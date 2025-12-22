# Fixture creation steps

The content below contains the full fixture creation steps and examples used in the project.

```txt
🧩 Step 1: What is a Fixture?

    👉 In Playwright, a fixture is a reusable setup that provides something
        (like browser, page, API client, DB connection, etc.) to your tests.

    Think of it like a utility provider for your test.

    🔹 Example:

    - Playwright already gives built-in fixtures — browser, context, page, request, etc.
    - But you can also create your own, like we did: api.
    - So instead of repeating setup code in every test, you define it once in a fixture and reuse it anywhere.


🧠 Step 2: Why do we need custom fixtures?

    Without fixtures, you’d repeat setup in every test:

    test('Get articles', async ({ request }) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const apiClient = new RequestHandlerAPIClient(request, baseUrl);
        const response = await apiClient.path('/articles').getRequest();
    });

    That’s repetitive.
    With a fixture, you move setup logic once, and your test becomes neat:

    test('Get articles', async ({ api }) => {
        const response = await api.path('/articles').getRequest();
    });



⚙️ Step 3: How does a fixture work internally?

    Playwright fixtures are built on top of its test runner — each fixture can:
        - Create something before the test runs.
        - Provide it to the test.
        - Clean it up after the test (optional).

    When you define a fixture using base.extend(), Playwright automatically handles:
        - Setup before test
        - Teardown after test
        - Dependency injection (injects it into the test function)


🎯 Story Setup: “Fixture ka Real-Life Analogy”

    Imagine you’re in a big company cafeteria 🍽️.
    Every employee (test case) comes for lunch, and they need:

        - A plate 🍽️ (browser or API client)
        - A spoon 🥄 (page, request, etc.)
        - Food 🍛 (data or environment setup)

    Now, if every employee brought their own plate, spoon, and food — total mess 😅
    So, the company creates a “kitchen service” — that prepares and provides these things automatically
    before each person comes in.

    That’s what fixtures do in Playwright.
    They prepare and supply what your test needs, before the test runs.



🧩 Step 4: Create a Fixture Step by Step

    ✅ Step 4.1 — Import Playwright base

        import { test as base } from '@playwright/test';
        This is the base test object you’ll extend.

    ✅ Step 4.2 — Create a type for your fixture

        We define what we’ll provide via fixture — here, our API client.

        type ApiFixture = {
            api: IApiClient;
        };

    ✅ Step 4.3 — Extend base test to include your fixture

        export const test = base.extend<ApiFixture>({
            api: async ({ request }, use) => {
                const baseUrl = 'https://conduit-api.bondaracademy.com/api';
                const apiClient = new RequestHandlerAPIClient(request, baseUrl);
                await use(apiClient); // Provide it to the test
            },
        });

        Let’s break this:

            - { request } → built-in Playwright fixture injected by Playwright.
            - use(apiClient) → tells Playwright “this is what I’m providing for this fixture.”
            - The value (apiClient) is then available in tests as { api }.

        So, Playwright will:

            - Run this function before the test.
            - Pass apiClient to your test.
            - Dispose it automatically after test (if needed).

Let’s break it down like a story 👇

🪄 Step 1: “Base Test” — the original kitchen

    Playwright already has a test kitchen — it gives you built-in fixture like:

    - browser
    - context
    - page
    - request

    But you want to add one more dish[fixture]: your custom API client.
    So you say:
        import { test as base } from '@playwright/test';
    That’s like saying — “I’ll take your base kitchen[fixture], but I’ll upgrade it with my own menu item[our custom fixture].”



🧱 Step 2: Create a “Fixture Type” — Blueprint of What You’re Adding

    You create a type to describe your new service[fixture]:

    type ApiFixture = {
        api: IApiClient;
    };


👉 Here:

    api is the key (the name you’ll use inside tests — like { api }).

    IApiClient is the type of object you’ll provide.

    So it’s like saying:

    “In my kitchen[already existing fixture], I’ll add one new dish[new custom fixture] called api,
    and it will serve an API client.”


🧠 Step 3: Extend the base test — add your new service

    Now you take the base test and say:

    export const test = base.extend<ApiFixture>({...});


    Here:

    - base.extend = “extend the base functionality of test”
    - <ApiFixture> = “define what new item(s) you are adding to the test”

    Inside {} you give key-value pairs where:

    - key = fixture name (like api)
    - value = async function that tells Playwright how to prepare and provide that fixture

⚙️ Step 4: Inside the async function
    api: async ({ request }, use) => {
      const baseUrl = 'https://conduit-api.bondaracademy.com/api';
      const apiClient = new RequestHandlerAPIClient(request, baseUrl);
      await use(apiClient);
    }


Let’s understand each word deeply:

Part	Meaning
api: Name of your fixture (you’ll access it in tests as { api })
async ({ request }, use)	Playwright automatically injects other fixtures (like request), and gives you a use callback
const apiClient = new RequestHandlerAPIClient(request, baseUrl)	You create a new object of your API client class — fresh for every test
await use(apiClient)	You hand over this object to Playwright — it will inject it into your test, then run the test, then clean it up afterward

🌀 Step 5: Lifecycle Story (Easy to Remember)

Phase	What Happens	Real-Life Analogy
Before Test	Fixture function runs — creates your API client	Kitchen prepares your meal
During Test	Playwright injects fixture into test ({ api })	You get your food on table
After Test	Playwright disposes fixture (optional cleanup)	Kitchen clears plate after eating

So yes ✅ — each test gets a fresh new instance of your RequestHandlerAPIClient.
That’s why there’s no shared state between tests → cleaner, safer, SRP-friendly design.

🧩 Step 6: use() — Magic Keyword Explained

    Think of use() like Playwright’s waiter 🍽️.

    When you do:

        await use(apiClient);

    You’re telling Playwright:

    “Here’s the thing I’ve prepared (apiClient). Give it to the test and run it. Once the test is done, come back and clean up.”

    That’s why it’s always the last step inside your fixture.

🧠 Step 7: Using It in Test
    test('Fetch Articles', async ({ api }) => {
      const res = await api.path('/articles').getRequest();
    });


    Now, Playwright automatically:

    - Runs your fixture before this test.
    - Creates a new RequestHandlerAPIClient object.
    - Passes it as { api } in your test.
    - Cleans up afterward.

🧱 Step 8: Big Picture Summary (Interview-friendly)

    “A fixture in Playwright is a setup function that prepares and provides reusable components (like API clients, browsers, DB connections) to test cases.
    It runs before each test, injects the dependency automatically, and optionally cleans up afterward.
    We define fixtures using base.extend(), where we provide key–value pairs — key being the fixture name and value being an async setup function.
    The use() callback hands over the prepared object to Playwright, which makes it available to the test.
    Each test gets its own isolated instance — ensuring cleaner, maintainable, and SOLID-compliant code.”
```
