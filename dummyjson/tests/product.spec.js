const { test, expect } = require('@playwright/test');

test('Get products from DummyJSON', async ({ request }) => {

    const response = await request.get('/products');

    console.log('Status Code:', response.status());

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    console.log(responseBody);

});