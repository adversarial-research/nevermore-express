nevermore-express
=================

A simple way to do nevermore encoding as a post-process within an express app. Binds itself to express as a side-effect of inclusion.

```js
import express from 'express';
import 'nevermore-express';

const app = express();
app.get('/endpoint', (req, res)=>{
    res.nevermore(htmlBody);
});
app.listen(8080);
```

Development
-----------
This release is currently unlicensed and should be treated as proprietary, but open meaning I am not currently accepting collaboration while I move toward 1.0 nor is this version of the code available for redistribution. I am currently evaluating source licenses for a future release during beta.

I am also looking for a robot license, should such a thing exist or some generous legal professional want to help in the creation of one.

Enjoy,
- Abbey Hawk Sparrow