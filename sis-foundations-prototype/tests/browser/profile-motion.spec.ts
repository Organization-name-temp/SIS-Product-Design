import{test,expect}from'@playwright/test';
test('the active profile normalizes old font and language choices',async({page})=>{
 await page.goto('/?item=typography&font=cairo&lang=fr&compare=fonts');await expect(page.locator('html')).toHaveAttribute('data-font','ibm');await expect(page.locator('html')).toHaveAttribute('lang','en');expect(page.url()).toContain('font=ibm');expect(page.url()).toContain('compare=none');await expect(page.getByLabel('Language',{exact:true}).locator('option')).toHaveCount(2);await expect(page.getByRole('combobox',{name:'Font',exact:true})).toHaveCount(0);await expect(page.frameLocator('iframe').first().locator('.fd-font-card')).toHaveCount(1);
});
test('every approved spacing value has a measured example and misuse rule',async({page})=>{
 await page.goto('/?embed=1&item=spacing');const rows=page.locator('.usage-row');await expect(rows).toHaveCount(11);for(const value of [0,2,4,6,8,12,16,24,32,48,64]){const row=page.locator(`[data-usage-value="${value}"]`);await expect(row).toContainText(`--ref-space-${value}`);await expect(row).toContainText('Avoid:');expect(await row.locator('.usage-gap,.usage-padding').evaluate((el,value)=>getComputedStyle(el)[value>=16?'paddingTop':'gap'],value)).toBe(`${value}px`);}
});
test('radius and icon examples retain every value and interaction target',async({page})=>{
 await page.goto('/?embed=1&item=borders');await expect(page.locator('.usage-row')).toHaveCount(5);await page.getByRole('button',{name:'Open control example',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await page.goto('/?embed=1&item=icons');await expect(page.locator('.usage-row')).toHaveCount(3);for(const size of [16,20,24]){const button=page.getByRole('button',{name:`Download sample at ${size}px`,exact:true});const box=await button.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);}
});
test('springs replay, complete, cancel, and export the selected deterministic profile',async({page})=>{
 await page.goto('/?embed=1&item=motion');await page.getByLabel('Motion model',{exact:true}).selectOption('spring');await page.getByLabel('Spring profile',{exact:true}).selectOption('expressive');await expect(page.locator('.spring-graph polyline')).toHaveCount(1);await page.getByRole('button',{name:'Play selected motion',exact:true}).click();await expect(page.getByTestId('motion-result')).toHaveText('Motion complete');await page.getByRole('button',{name:'Play selected motion',exact:true}).click();await page.getByRole('button',{name:'Cancel motion',exact:true}).click();await expect(page.getByTestId('motion-result')).toHaveText('Motion cancelled');expect(await page.locator('.motion-subject').evaluate(el=>el.getAnimations().length)).toBe(0);await expect(page.locator('.motion-workbench pre')).toContainText('"damping": 18');
});
test('reduced motion removes spring movement and preserves immediate state',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?embed=1&item=motion&lang=ar');await page.getByLabel('نموذج الحركة',{exact:true}).selectOption('spring');await page.getByRole('button',{name:'تشغيل الحركة المختارة',exact:true}).click();await expect(page.getByTestId('motion-result')).toHaveText('تحديث فوري. أزيلت الحركة.');expect(await page.locator('.motion-subject').evaluate(el=>el.getAnimations().length)).toBe(0);
});
test('responsive layouts work between presets in both directions',async({page})=>{
 for(const width of [320,375,768,1024,1440])for(const lang of ['en','ar']){await page.setViewportSize({width,height:900});await page.goto(`/?item=spacing&lang=${lang}&theme=dark`);await page.frameLocator('iframe').first().locator('.usage-row').first().waitFor();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);const body=page.frameLocator('iframe').first().locator('body');expect(await body.evaluate(el=>el.scrollWidth<=el.ownerDocument.documentElement.clientWidth+1)).toBeTruthy();}
});
test('task density recommendations preserve the explicit user override',async({page})=>{
 await page.goto('/?item=tables');await expect(page.getByLabel('Density',{exact:true})).toHaveValue('compact');
 await page.getByRole('link',{name:'Spacing and density',exact:true}).click();await expect(page.getByLabel('Density',{exact:true})).toHaveValue('comfortable');
 await page.getByLabel('Density',{exact:true}).selectOption('compact');await page.getByRole('link',{name:'Colors and themes',exact:true}).click();await expect(page.getByLabel('Density',{exact:true})).toHaveValue('compact');
});
