

// pm2 start index.js -i 1 --name remog-cron --cron */58 * * * *

var wordListExtra = require('./words-extra.js').wordListExtra; // Manual addition exclusion list
var thisPath = "/srv/remog/";
const wordListMZ = require('./words-large-mz.js').wordList; // Second half of exclusion list
const wordListAD = require('./words-large-ad.js').wordList; // First half of exclusion list
const wordListDL = require('./words-large-dl.js').wordList; // First half of exclusion list
const suffixes = ['able', 'acy', 'ade', 'age', 'al', 'an', 'ance', 'ancy', 'ant', 'ar', 'ard', 'art', 'ary', 'ate', 'ate', 'ate', 'ation', 'ative', 'cade', 'cy', 'drome', 'ed', 'ed', 'en', 'en', 'ence', 'ence', 'ency', 'ent', 'eous', 'er', 'ery', 'es', 'ess', 'est', 'fold', 'ful', 'fy', 'ia', 'ial', 'ian', 'iatry', 'ible', 'ic', 'ic', 'ical', 'ice', 'ient', 'ier', 'ies', 'ies', 'iest', 'ify', 'ile', 'ing', 'ing', 'ing', 'ion', 'ious', 'ish', 'ism', 'ist', 'ite', 'itive', 'ity', 'ive', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'or', 'ory', 'ose', 'ous', 'ship', 'ster', 'ty', 'ure', 'ward', 'wise', 'y'];
const roots = ['a', 'ab', 'abs', 'ac', 'acer', 'acid', 'acri', 'act', 'acu', 'ad', 'aer', 'aero', 'af', 'ag', 'agi', 'agri', 'agro', 'al', 'alb', 'albo', 'ali', 'allo', 'alt', 'alter', 'am', 'ambi', 'ambul', 'ami', 'amor', 'an', 'ana', 'andr', 'andro', 'ang', 'anim', 'ann', 'annu', 'ano', 'ant', 'ante', 'anthrop', 'anti', 'antico', 'ap', 'aph', 'apo', 'aqu', 'arch', 'as', 'aster', 'astr', 'at', 'auc', 'aud', 'audi', 'aug', 'aug', 'aur', 'aus', 'aut', 'auto', 'bar', 'be', 'belli', 'bene', 'bi', 'bibl', 'bibli', 'biblio', 'bine', 'bio', 'brev', 'cad', 'calor', 'cap', 'capit', 'capt', 'cardi', 'carn', 'cas', 'cat', 'cata', 'cath', 'caus', 'cause', 'caut', 'ceas', 'ced', 'cede', 'ceed', 'ceiv', 'cent', 'centr', 'centri', 'cept', 'cess', 'chrom', 'chron', 'cid', 'cide', 'cip', 'circum', 'cis', 'cise', 'cit', 'civ', 'claim', 'clam', 'clin', 'clud', 'clus', 'claus', 'co', 'cog', 'cogn', 'col', 'coll', 'com', 'con', 'contr', 'contra', 'cor', 'cord', 'corp', 'cort', 'cosm', 'counter', 'cour', 'cracy', 'crat', 'cre', 'crea', 'crease', 'cred', 'cresc', 'cret', 'crit', 'cru', 'cur', 'cura', 'curr', 'curs', 'cus', 'cuse', 'cycl', 'cyclo', 'de', 'dec', 'deca', 'dei', 'dem', 'demo', 'dent', 'derm', 'di', 'dia', 'dic', 'dict', 'dif', 'dign', 'dis', 'dit', 'div', 'doc', 'doct', 'domin', 'don', 'dont', 'dorm', 'dox', 'duc', 'duct', 'dura', 'dy', 'dynam', 'dys', 'e', 'ec', 'eco', 'ecto', 'em', 'en', 'end', 'enni', 'epi', 'equi', 'erg', 'et', 'ev', 'ex', 'exter', 'extra', 'extro', 'fa', 'fac', 'fact', 'fain', 'fall', 'fals', 'fan', 'fant', 'fas', 'fea', 'feat', 'fec', 'fect', 'feder', 'feign', 'femto', 'fer', 'fess', 'fic', 'fic', 'fid', 'fide', 'fig', 'fila', 'fili', 'fin', 'fit', 'fix', 'flect', 'flex', 'flict', 'flu', 'fluc', 'fluv', 'flux', 'for', 'forc', 'fore', 'form', 'fort', 'fract', 'frag', 'frai', 'fuge', 'fuse', 'gam', 'gastr', 'gastro', 'gen', 'geo', 'germ', 'gest', 'giga', 'gin', 'glo', 'gloss', 'glot', 'glu', 'gnant', 'gnos', 'gor', 'grad', 'graf', 'gram', 'graph', 'grat', 'grav', 'gree', 'greg', 'gress', 'hale', 'heal', 'helio', 'hema', 'hemo', 'her', 'here', 'hes', 'hetero', 'hex', 'homo', 'hum', 'human', 'hydr', 'hydra', 'hydro', 'hyper', 'hypn', 'ics', 'ig', 'ignis', 'il', 'im', 'in', 'infra', 'inter', 'intra', 'intro', 'ir', 'jac', 'ject', 'join', 'judice', 'jug', 'junct', 'just', 'juven', 'kilo', 'labor', 'lau', 'lav', 'leag', 'lect', 'leg', 'levi', 'lex', 'liber', 'lide', 'lig', 'liter', 'liver', 'loc', 'loco', 'locut', 'log', 'logo', 'loqu', 'lot', 'luc', 'lude', 'lum', 'lun', 'lus', 'lust', 'lut', 'macer', 'macr', 'magn', 'main', 'mal', 'man', 'mand', 'mania', 'manu', 'mar', 'mari', 'matri', 'medi', 'mega', 'mem', 'ment', 'mer', 'meso', 'meta', 'meter', 'metr', 'micro', 'migra', 'mill', 'milli', 'min', 'mis', 'miss', 'mit', 'mob', 'mon', 'mono', 'mor', 'morph', 'mort', 'mot', 'mov', 'multi', 'nai', 'nano', 'nasc', 'nat', 'neo', 'neur', 'noc', 'nom', 'nomen', 'nomin', 'non', 'nov', 'nox', 'numer', 'numisma', 'nym', 'ob', 'oc', 'oct', 'of', 'oligo', 'ology', 'omni', 'onym', 'op', 'oper', 'ortho', 'over', 'pac', 'pair', 'paleo', 'pan', 'para', 'pare', 'pass', 'pat', 'pater', 'path', 'pathy', 'patr', 'ped', 'pedo', 'pel', 'pend', 'pens', 'penta', 'per', 'peri', 'phage', 'phan', 'phant', 'phas', 'phe', 'phen', 'phil', 'phlegma', 'phobia', 'phobos', 'phon', 'phot', 'photo', 'pico', 'pict', 'plac', 'plais', 'pli', 'plore', 'plu', 'plur', 'plus', 'ply', 'pneuma', 'pneumon', 'pod', 'poli', 'poly', 'pon', 'pond', 'pop', 'port', 'portion', 'pos', 'post', 'pot', 'pound', 'pre', 'prehendere', 'prim', 'prime', 'prin', 'pro', 'proto', 'psych', 'puls', 'punct', 'pur', 'pute', 'quad', 'quat', 'quer', 'quest', 'quint', 'quip', 'quir', 'quis', 're', 'recti', 'reg', 'retro', 'ri', 'ridi', 'risi', 'rog', 'roga', 'rupt', 'sacr', 'salu', 'salv', 'sanc', 'sanct', 'sat', 'satis', 'scen', 'sci', 'scientia', 'scio', 'scope', 'scrib', 'script', 'se', 'sec', 'secr', 'sect', 'secu', 'sed', 'semi', 'sen', 'sens', 'sent', 'sept', 'sequ', 'serv', 'ses', 'sess', 'sid', 'sign', 'signi', 'simil', 'simul', 'sist', 'soci', 'sol', 'solu', 'solus', 'solut', 'solv', 'somn', 'soph', 'spec', 'spect', 'sper', 'sphere', 'spi', 'spic', 'spir', 'st', 'sta', 'sta', 'stab', 'stan', 'stand', 'stant', 'stat', 'stead', 'sti', 'stige', 'stit', 'strain', 'strict', 'string', 'stroy', 'stru', 'struct', 'stry', 'sub', 'suc', 'sue', 'suf', 'sume', 'sump', 'sup', 'super', 'supra', 'sur', 'sus', 'sym', 'syn', 'tact', 'tag', 'tain', 'tang', 'tect', 'teg', 'tele', 'tem', 'tempo', 'ten', 'tend', 'tens', 'tent', 'tera', 'term', 'terr', 'terra', 'test', 'the', 'theo', 'therm', 'thesis', 'thet', 'tig', 'tin', 'ting', 'tire', 'tom', 'tor', 'tors', 'tort', 'tox', 'tra', 'tract', 'trai', 'trans', 'treat', 'tri', 'trib', 'tribute', 'typ', 'ultima', 'umber', 'umbraticum', 'un', 'uni', 'vac', 'vade', 'vale', 'vali', 'valu', 'vect', 'veh', 'ven', 'vent', 'ver', 'verb', 'veri', 'vers', 'vert', 'verv', 'vi', 'vic', 'vicis', 'vict', 'vid', 'vinc', 'vis', 'vita', 'viv', 'vivi', 'voc', 'voke', 'vol', 'volcan', 'volt', 'volv', 'vor', 'with', 'zo'];
var Guid = require('guid');
var gm = require('gm');
var Twitter = require('twitter');
const imgDest = Guid.raw() + ".jpg"
var wordList = wordListDL.concat(wordListMZ).concat(wordListAD);
var client = new Twitter(twitOpts);
word = makeTwit();
var sniff = doImage(word);

function makeTwit() {
    console.log('Roots: ' + roots.length + ' Suffixes: ' + suffixes.length + ' Check Words: ' + wordList.length + ' Extra Words: ' + wordListExtra.length);
    do {
        var root1 = roots[Math.floor(Math.random() * roots.length)]; // First part of word
        var word = root1;
        if (Math.random() >= 0.85) { //  15% of the time add part of word
            var word = word + roots[Math.floor(Math.random() * roots.length)];
        }
        if (Math.random() >= 0.995) { // 0.5% of the time add another part of word
            var word = word + roots[Math.floor(Math.random() * roots.length)];
        }
        var suffix = suffixes[Math.floor(Math.random() * suffixes.length)]; // Add Suffix
        var word = word + suffix;
        console.log(word);
           } while ((word.indexOf('ii') >= 0) || (word.indexOf('tj') >= 0) || (word.indexOf('mt') >= 0) || (word.indexOf('tf') >= 0) || (word.indexOf('tc') >= 0) || (word.indexOf('cp') >= 0) || (word.indexOf('mf') >= 0) || (word.indexOf('aa') >= 0) || (word.indexOf('bf') >= 0) || (word.indexOf('tg') >= 0) || (word.indexOf('tq') >= 0) || (word.indexOf('uu') >= 0) || (word.indexOf('dj') >= 0) || (wordList.indexOf(word.toUpperCase()) >= 0) || (wordListExtra.indexOf(word.toUpperCase()) >= 0))
    console.log(word);
    return word;
}

function doTweet(word) {
    var tweetCard = "https://remoggle.com/"
    var data = require('fs').readFileSync(thisPath + imgDest);
    // Make post request on media endpoint. Pass file data as media parameter
    client.post('media/upload', {
        media: data
    }, function(error, media, response) {
        if (!error) {
            // If successful, a media object will be returned.
            console.log(media);
            // Lets tweet it
            var status = {
                status: word + ' @remoggle',
                media_ids: media.media_id_string // Pass the media id string
            }
            client.post('statuses/update', status, function(error, tweet, response) {
                if (!error) {
                    console.log(tweet);
                }
            });
        }
    });
}

function doImage(word) {
    //.region(WIDTH, HEIGHT, X, Y)
    //   .font(font)
    var wmCount = Math.floor(Math.random() * 4);
    var wmSize = 235 - word.length * 15;
    gm(thisPath + 'img/' + wmCount + 'wm_social.jpg').gravity('Center').fill('#FFFFFF').font(thisPath + "fnt/Rubik-Regular.ttf", wmSize).drawText(0, 0, word).write(thisPath + imgDest, function(err) {
        if (err) return console.dir(arguments)
        console.log(this.outname + ' created  :: ' + arguments[3])
        doTweet(word);
    });
    return 'remog';
}