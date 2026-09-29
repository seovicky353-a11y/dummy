const { test, expect } = require('@playwright/test');
const { productData } = require('../testdata/productData');

test('Create a new product via API', async ({ request }) => {
    const response = await request.post('/products/add', {
        headers: { 'Content-Type': 'application/json' },
        data: productData
    });

    console.log('Status Code:', response.status());
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    console.log('Created Product Details:', responseBody);

    expect(responseBody.id).toBeDefined();
    expect(responseBody.title).toBe(productData.title);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.category).toBe(productData.category);
});