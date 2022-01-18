## 백엔드 개발자 전성재 구현 정보

nestjs를 통해 구현 했습니다.

클론을 받으셨다면 npm install을 하신 후 .env 파일을 생성하여 DB_USERNAME , DB_PASSWORD, DB_DATABASE , PORT를 지정해주세요 database는 원하시는 이름으로 생성하셔서 이름을 넣으면 자동으로 테이블을 생성합니다! 단, npm start를 하기전에 ormconfig.ts로 가셔서 최초 연결 한 번만 synchronize: false => synchronize: true 바꿔주세요 설정하지 않을시 데이터베이스 테이블 자동 생성이 안됩니다! 처음 연동 후에는 다시 false로 바꾸고 계속 실행하시면 됩니다.

- 실행 하셨다면 localhost:{설정한 port번호}/api/로 가면 만들어진 api문서를 확인 하실 수 있습니다.

- 가입 기능이 필요없다고 하여 정말 간단한 가입 기능만 만들었습니다!

- 모든 문서 요청시 INBOX는 자신의 차례가 아니면 아예 불러오지 않도록 만들었으며 본인의 승인 차례가 된다면 불러와 집니다.

- 문서과 최종적으로 승인인지 거절인지는 true, false로 판단합니다. 승인 => true, 거절 => false

- pending 테이블에 status는 총 4가지를 구상하고 사용하였고 승인을 해야한다면 yet, 아직 앞사람이 승인하지않았다면 pending, 승인이 완료되면 pass와 reject를 사용하여 최종 승인 여부를 구별합니다.

- document 테이블에 status는 총 2가지를 나타내며 내가 생성한 문서 중 결재 진행 중인 문서 => OUTBOX,
  내가 관여한 문서 중 결재가 완료(승인 또는 거절)된 문서 => ARCHIVE 두 가지를 사용하고 있으며 status가 ARCHIVE일시 approval은 true 혹은 false로 승인여부를 나타내며 아직 결재 완료가 아닐 시 null 입니다.

- 승인시 comment를 남길 수 있으며 남기지 않을 시 null을 defalut로 넣습니다.
