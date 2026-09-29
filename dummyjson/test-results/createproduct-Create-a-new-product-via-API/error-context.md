# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: createproduct.spec.js >> Create a new product via API
- Location: createproduct.spec.js:4:1

# Error details

```
TypeError: apiRequestContext.post: Invalid URL
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { productData } = require('../testdata/productData');
  3  | 
  4  | test('Create a new product via API', async ({ request }) => {
> 5  |     const response = await request.post('/products/add', {
     |                                    ^ TypeError: apiRequestContext.post: Invalid URL
  6  |         headers: { 'Content-Type': 'application/json' },
  7  |         data: productData
  8  |     });
  9  | 
  10 |     console.log('Status Code:', response.status());
  11 |     expect(response.status()).toBe(201);
  12 | 
  13 |     const responseBody = await response.json();
  14 |     console.log('Created Product Details:', responseBody);
  15 | 
  16 |     expect(responseBody.id).toBeDefined();
  17 |     expect(responseBody.title).toBe(productData.title);
  18 |     expect(responseBody.price).toBe(productData.price);
  19 |     expect(responseBody.category).toBe(productData.category);
  20 | });
```