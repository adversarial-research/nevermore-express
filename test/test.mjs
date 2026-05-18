import { should as createShould } from 'chai';
const should = createShould();
import express from 'express';
import { parse } from 'parse5';
import * as csstree from 'css-tree';
import '../src/index.mjs';

let body = '';

const selectStyle = (ast, name)=>{
    let result = null;
    csstree.walk(ast, (node) => {
        if(node.type === 'ClassSelector' && node.name === name){
            result = node;
        }
    });
    return result;
}

const stylesMatch = (contentTag, styleTag)=>{
    const ast = csstree.parse(styleTag.childNodes[0].value);
    for(let lcv=0; lcv < contentTag.childNodes.length; lcv++){
        if(contentTag.childNodes[lcv].tagName === 'span'){
            contentTag.childNodes[lcv].attrs.forEach((attr)=>{
                const styles = attr.value.split(' ');
                if(styles.indexOf('guarded') !== -1){
                    const filtered = styles.filter((styleName)=>{
                        if(styleName === 'guarded' || styleName === ''){
                            return false;
                        }
                        return true;
                    });
                    const style = selectStyle(ast, filtered[0]);
                    should.exist(style);
                    should.exist(filtered[0]);
                    filtered[0].should.equal(style.name);
                }
            });
        }
    }
}

const selectTags = (node, tag) => {
    let results = [];
    for (let i = 0; i < node.childNodes?.length; i++) {
        if(node.childNodes[i].tagName === tag){
            results.push(node.childNodes[i]);
        }
        results = [...results, ...selectTags(node.childNodes[i], tag)];
    }

    return results;
};

describe('nevermore', ()=>{
    let server = null;
    before((done)=>{
        const app = express();
        app.get('/test1', (req, res)=>{
            res.nevermore(body);
        });
        server = app.listen(8082, ()=>{
            done();
        });
    });
    
    it('encodes output', async function(){
        this.timeout(15000);
        const url = 'http://localhost:8082/test1';
        const requestedBody = await(await fetch(url)).text();
        const parsed = parse(requestedBody);
        const pTags = selectTags(parsed, 'div');
        const styleTags = selectTags(parsed, 'style');
        for(let lcv=0; lcv < pTags.length ; lcv++){
            stylesMatch(pTags[lcv], styleTags[lcv]);
        }
    });
    
    after((done)=>{
        server.close(()=>{
            done();
        })
    })
})

body = `
<html>
    <head></head>
    <body>
        <div>Meanwhile the doctor was saying, “The reason there are so many people on the river these days is because there are too many people everywhere else.” Bonnie shivered, slipping into the crook of his left arm. “Why don’t we build a fire?” she said. “The wilderness once offered men a plausible way of life,” the doctor said. “Now it functions as a psychiatric refuge. Soon there will be no wilderness.” He sipped at his bourbon and ice. “Soon there will be no place to go. Then the madness becomes universal.” Another thought. “And the universe goes mad.”</div>
        <img src="test/images/dore_raven.jpeg"></img>
        <div>We have no idea, now, of who or what the inhabitants of our future might be. In that sense, we have no future. Not in the sense that our grandparents had a future, or thought they did. Fully imagined cultural futures were the luxury of another day, one in which 'now' was of some greater duration. For us, of course, things can change so abruptly, so violently, so profoundly, that futures like our grandparents' have insufficient 'now' to stand on. We have no future because our present is too volatile. ... We have only risk management. The spinning of the given moment's scenarios. Pattern recognition</div>
        <img src="test/images/test.jpg"></img>
        <div>For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man—for precisely the same reasons.</div>
    </body>
</html>
`;