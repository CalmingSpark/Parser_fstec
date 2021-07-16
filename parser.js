 const https = require('https')
 const fs = require('fs')


function readURL(url) {
   
    return new Promise((strolve, reject) => {
       
        https.get(url, (str) => {
            const { statusCode } = str;
           
            let error;
            if (statusCode !== 200) {
                error = new Error('Ошибка запроса. Код ответа: ${statusCode}');
            }

            if (error) {

                reject(error);
                str.strume();
                return;
            }
           
            str.setEncoding('utf8');

            let rawData = '';
            str.on('data', chunk => rawData += chunk);
            str.on('end', () => strolve(rawData));
        }).on('error', (e) => reject(e)); 
    })
}

/* readURL('https://fstec.ru/tekhnicheskaya-zashchita-informatsii/dokumenty-po-sertifikatsii/153-sistema-sertifikatsii/591-gosudarstvennyj-reestr-sertifitsirovannykh-sredstv-zashchity-informatsii-n-ross-ru-0001-01bi00')
    .then(data =>
        parsingFile(data)
    )
    .catch(err =>
        console.log(err.message)
    )
*/
let fileContent = fs.readFileSync("fstec_html.txt", "utf8");
parsingFile(fileContent);

function parsingFile(data) {
    let text_html, text_json, indexStart, indexEnd, c;
    indexStart = data.lastIndexOf('<tbody>');
    indexEnd = data.lastIndexOf('</tbody>');
    if (indexStart != -1 && indexEnd != -1) {
       text_html = data.slice(indexStart, indexEnd);
       indexStart = text_html.lastIndexOf('ari-tbl-row-');
       indexEnd = text_html.lastIndexOf('<td class="ari-tbl-col-0">');
       c = text_html.slice(indexStart, indexEnd);
       c = c.replace(/[^0-9]/g, '');
       var str = [];
       let del = `</td>`;
       const replacer = new RegExp(del, 'g')
       for (let i = 0; i < c + 1; i++) {
            let Start_row = 'tr class=" ari-tbl-row-' + i;
            let End_row = 'tr class=" ari-tbl-row-' + (i + 1);
            indexStart = text_html.indexOf(Start_row);
            indexEnd = text_html.indexOf(End_row);
            str[i] = text_html.slice(indexStart, indexEnd);     
            str[i] = str[i].replace(Start_row,``);
            str[i] = str[i].replace(replacer,`",`);
            str[i] = str[i].replace(/">\n/g,``);
            str[i] = str[i].replace(`<td class="ari-tbl-col-0">`,`{\n"number":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-1">`,`"date of deposit":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-2">`,`"validity period":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-3">`,`"cipher":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-4">`,`"names of documents":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-5">`,`"certification scheme":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-6">`,`"testing laboratory":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-7">`,`"certification body":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-8">`,`"the applicant":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-9">`,`"details of the applicant":"`);
            str[i] = str[i].replace(`<td class="ari-tbl-col-10">`,`"end of the technical support period":"`);

            str[i] = str[i].replace(/</g,``);
            str[i] = str[i].replace(/\t/g,``);
            if (i != c) {str[i] = str[i].replace(`/tr>`,`},`);}
            else {str[i] = str[i].replace(`/tr>`,`}`)}
            text_json += str[i];

/*            fs.appendFile("fstec_File.json", str[i], function(error){
            if(error) throw error; // если возникла ошибка
                         
            console.log("Запись файла завершена.");
            });
*/        }
        fs.writeFile('fstec_File.json', text_json, (err) => {
        if(err) throw err;
        console.log('Json has been writing!');
        })
        }
    else{console.log('tbody not found')}
    return 0;
}



/*        fs.writeFile('fstec_htmlFile.txt', data, (err) => {
        if(err) throw err;
        console.log('Data has been writing!');
        })
*/

/*<tr class=" ari-tbl-row-1838">
<td class="ari-tbl-col-0">4424</td>
<td class="ari-tbl-col-1">28.06.2021</td>
<td class="ari-tbl-col-2">28.06.2026</td>
<td class="ari-tbl-col-3">программный комплекс «Серчинформ SIEM версии 3.0»</td>
<td class="ari-tbl-col-4">Соответствует требованиям документов: Требования доверия(4), ТУ</td>
<td class="ari-tbl-col-5">серия</td>
<td class="ari-tbl-col-6">АО «ДОКУМЕНТАЛЬНЫЕ СИСТЕМЫ»</td>
<td class="ari-tbl-col-7">АО «НПО «Эшелон»</td>
<td class="ari-tbl-col-8">ООО «СерчИнформ»</td>
<td class="ari-tbl-col-9">121069, Москва, Скатертный переулок, д. 8/1, стр. 1, пом. I, комн. 2, (495) 721-8406</td>
<td class="ari-tbl-col-10"></td>
*/