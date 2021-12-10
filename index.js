const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const myPage = 'https://www.dns-shop.ru/catalog/17a892f816404e77/noutbuki/?f[p3q]=b3ci&fr[65w]=15.7-17.3&f[67l]=l5bb7-kfzsu-yurhl-15nhh4';

async function exec() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
      ],
    });

    const page = await browser.newPage();

    await setBlockingOnRequests(page);

    try {
        await page.goto(myPage,  { waitUntil: 'domcontentloaded' });
        
      } catch (error) {
        console.log('Не могу открыть страницу');
        console.log(error);
    
        await page.close();
        await browser.close();
        return;
      }
      
      try {
        await page.waitForSelector('body > div.container.category-child > div', { timeout: 1000 });
        const nbCount = (await page.$$('.catalog-product')).length;
    
        console.log(nbCount);

      } catch (error) {
        console.log ('Не могу найти нотубки');
        console.log(error);
        await page.close();
        await browser.close();
      }


      try {
        const content = await page.content();
        const $ = cheerio.load(content);

        const notebooks = [];

        let count = $('.catalog-product__name').length;

        for (let i = 0; i<count; i++) {
            let title = 
        }

        $('.catalog-product__name').each((idx, elem) => {
            const notebook = {
                title: $(elem).text()
                price: 
                img: 
                id: 
            }
            notebooks.push(notebook);
        })

        console.log (notebooks);
      }
      catch (error) {
          console.log ('Не могу скачать содержимое страницы');
          console.log (error);
          await page.close();
          await browser.close();
      }
    }


    async function setBlockingOnRequests(page) {
        await page.setRequestInterception(true);
      
        page.on('request', (req) => {
          if (req.resourceType() === 'image'
            || req.resourceType() === 'media'
            || req.resourceType() === 'font'
            || req.resourceType() === 'stylesheet'
            || req.url()
              .includes('yandex')
            || req.url()
              .includes('facebook')
            || req.url()
              .includes('analytics')
            || req.url()
              .includes('vk.com')
            || req.url()
              .includes('retailrocket')
            || req.url()
              .includes('mail.ru')
          ) {
            req.abort();
          } else {
            req.continue();
          }
        });
      }


    exec();