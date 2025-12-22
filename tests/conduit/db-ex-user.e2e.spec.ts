import { test, expect } from '../../fixtures/dbFixture';
import { getUserByUserId } from '../../db/userQueries';
//import { assertUserCreated } from '../../db/dbAssertions';

test('API → DB validation using fixture', async ({ request, db }) => {

  // API call (mock or real)
  // const response = await request.post('/users', {
  //   data: {
  //     userId: 'USR_003',
  //     email: 'usr003@test.com'
  //   }
  // });

  // expect(response.status()).toBe(201);
  // const body = await response.json();


  const userId = 'USR_001'; // existing DB value

  const rows = await getUserByUserId(db, userId);

  console.log(rows);

  expect(rows.length).toBe(1);
  expect(rows[0].user_id).toBe(userId);
});


