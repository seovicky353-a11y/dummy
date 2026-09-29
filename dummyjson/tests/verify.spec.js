const { test, expect } = require('@playwright/test');

test('Verify particular product details', async ({ request }) => {

    const productId = 1;

    const response = await request.get(`/products/${productId}`);

    console.log('Status Code:', response.status());

    expect(response.status()).toBe(200);

    const product = await response.json();

    console.log('Product ID:', product.id);
    console.log('Product Name:', product.title);
    console.log('Price:', product.price);
    console.log('Category:', product.category);
    console.log('Stock:', product.stock);

    // Verify product details
    expect(product.id).toBe(productId);
    expect(product.title).toBeDefined();
    expect(product.price).toBeDefined();
    expect(product.category).toBeDefined();
    expect(product.stock).toBeDefined();
});