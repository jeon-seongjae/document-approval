import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/Document';
import { Pending } from 'src/entities/Pending';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdatePendingDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Pending)
    private pendingRepository: Repository<Pending>,
  ) {}

  async create({ title, content, userId, approver }: CreateDocumentDto) {
    const set = new Set(approver);

    if (set.size < approver.length) {
      throw new UnauthorizedException('결재자가 중복 되었습니다.');
    }
    const document = await this.documentRepository.findOne({
      where: { title: title, userId: userId, deleted: false },
    });

    if (document) {
      throw new UnauthorizedException('동일한 문서가 존재합니다.');
    }

    let approverIdList: number[] = [];

    console.log(typeof approverIdList);

    for (const approverEmail of approver) {
      const approverId = await this.usersRepository.findOne({
        where: { email: approverEmail, deleted: false },
      });
      if (!approverId) {
        throw new UnauthorizedException('유효하지 않은 결재자 아이디 입니다.');
      }
      approverIdList.push(approverId.id);
    }

    const documentId = await this.documentRepository.save({
      title,
      content,
      userId,
    });

    for (const [index, approver] of approverIdList.entries()) {
      if (index === 0) {
        await this.pendingRepository.save({
          documentId: documentId.id,
          approverId: approver,
          status: 'yet',
        });
      } else {
        await this.pendingRepository.save({
          documentId: documentId.id,
          approverId: approver,
        });
      }
    }

    return { message: '문서 생성이 완료되었습니다.' };
  }

  async findAll(userId: number) {
    const outbox = await this.documentRepository
      .find({
        where: { userId: userId, status: 'OUTBOX', deleted: false },
      })
      .then((res) => {
        if (res.length === 0) {
          return '결재 진행 중인 문서가 없습니다.';
        } else {
          return res;
        }
      });

    const inbox = await this.pendingRepository
      .find({
        where: { approverId: userId, status: 'yet' },
        select: ['documentId'],
      })
      .then(async (res) => {
        if (res.length === 0) {
          return '결재 할 문서가 없습니다.';
        }
        let documentInbox: any = [];
        for (const docId of res) {
          let inboxDocument = await this.documentRepository.findOne({
            where: { id: docId.documentId, status: 'OUTBOX', deleted: false },
          });
          documentInbox.push(Object.assign(inboxDocument, docId));
        }

        return documentInbox;
      });

    let archivePending = { comment: [] };
    let addPending = [];
    const pendRes = await this.pendingRepository
      .find({
        where: { approverId: userId },
        select: ['documentId'],
      })
      .then(async (secRes) => {
        if (secRes.length === 0) return [];
        for (const selectClear of secRes) {
          archivePending = { comment: [] };
          await this.documentRepository
            .findOne({
              where: { id: selectClear.documentId, status: 'ARCHIVE' },
            })
            .then(async (data) => {
              if (data) {
                await this.pendingRepository
                  .find({
                    where: { documentId: data.id },
                    select: ['approverId', 'comment'],
                  })
                  .then(async (pendingInfo) => {
                    for (const docComment of pendingInfo) {
                      await this.usersRepository
                        .findOne({
                          where: {
                            id: docComment.approverId,
                            deleted: false,
                          },
                          select: ['email'],
                        })
                        .then((email) => {
                          archivePending.comment.push({
                            email: email.email,
                            comment: docComment.comment,
                          });
                        });
                    }
                  });
                console.log(archivePending);
                addPending.push({ ...data, ...archivePending });
              }
            });
        }
        return addPending;
      });

    const archive = await this.documentRepository
      .find({
        where: { userId: userId, status: 'ARCHIVE', deleted: false },
      })
      .then(async (res) => {
        if (res.length === 0 && pendRes.length === 0) {
          return '완료된 문서가 없습니다.';
        } else {
          if (res.length === 0) return addPending;
          let resultArchive = { comment: [] };
          let result = [];
          for (const comment of res) {
            await this.pendingRepository
              .find({
                where: { documentId: comment.id },
                select: ['approverId', 'comment'],
              })
              .then(async (comm) => {
                for (const userEmail of comm) {
                  await this.usersRepository
                    .findOne({
                      where: { id: userEmail.approverId, deleted: false },
                      select: ['email'],
                    })
                    .then((email) => {
                      resultArchive.comment.push({
                        email: email.email,
                        comment: userEmail.comment,
                      });
                    });
                }
                result.push({ ...comment, ...resultArchive });
              });
          }
          return result;
        }
      });

    if (typeof archive === 'string') {
      return {
        outbox: outbox,
        inbox: inbox,
        archive: '완료된 문서가 없습니다.',
      };
    }
    let test = [...archive, ...pendRes];
    const map = new Map();
    for (const character of test) {
      map.set(JSON.stringify(character), character);
    }
    const archiveUnique = [...map.values()];

    return { outbox: outbox, inbox: inbox, archive: archiveUnique };
  }

  async selectDocument(documentId: number) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, deleted: false },
    });
    if (document) {
      return document;
    }
    throw new UnauthorizedException('존재하지 않는 문서입니다.');
  }

  async update({ status, comment, documentId }: UpdatePendingDto) {
    const approvalUpdate = await this.pendingRepository.find({
      where: { documentId: documentId },
    });
    if (approvalUpdate.length === 0) {
      throw new UnauthorizedException('유효하지 않은 결재 문서입니다.');
    }

    let next: number = 0;
    let approvalResult: boolean = true;

    for (const [index, update] of approvalUpdate.entries()) {
      if (update.status === 'yet') {
        next = index + 1;
        update.status = status;
        update.comment = comment;

        await this.pendingRepository.save(update);

        if (index === approvalUpdate.length - 1) {
          const checkApproval = await this.pendingRepository.find({
            where: { documentId: documentId },
          });

          for (const check of checkApproval) {
            if (check.status === 'reject') {
              approvalResult = false;
              break;
            }
          }
          const documentUpdate = await this.documentRepository.findOne({
            where: { id: documentId, deleted: false },
          });

          documentUpdate.approval = approvalResult;
          documentUpdate.status = 'ARCHIVE';

          await this.documentRepository.save(documentUpdate);
        }
      } else if (index === next && update.status === 'pending') {
        update.status = 'yet';
        await this.pendingRepository.save(update);
        break;
      } else {
        return { message: '결제가 완료된 문서입니다.' };
      }
    }

    return { message: '결제가 완료 되었습니다.' };
  }
}
