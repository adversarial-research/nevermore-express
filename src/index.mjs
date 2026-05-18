import { computeIndexKeys } from 'ai-nevermore';
import { transformHTML } from 'ai-nevermore/html';
import { response } from 'express';
import { ServerResponse } from 'http';
import { parse } from 'parse5';

const res = response || ServerResponse.prototype;

res.nevermore = async function(content, options={}){
    try{
        let dictionary = options.dictionary;
        if(!dictionary)  dictionary = ( 
            await computeIndexKeys(content) 
        ).index;
        const parsed = parse(content);
        const result = await transformHTML(
            parsed, 
            dictionary, 
            './node_modules/ai-nevermore/textures'
        );
        return this.send(result);
    }catch(ex){
        console.log(ex);
        return cb(ex);
    }
};

