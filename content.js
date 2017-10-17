const compSet = ['ling', 'long'],
      semiCompSet = ['ring', 'rong', 'roing', 'rang', 'ram', 'rom', 'roim'],
      nonCompSet = ['om', 'oim', 'im', 'am', 'ing', 'oing', 'ong', 'ang'],
      qSet = ['uom', 'uoim', 'uim', 'uam', 'uing', 'uoing', 'uong', 'uang'],
      second_global = ['bop', 'blip', 'bip', 'dong'],
      second_ing = ['us'], //weight this one heavier
      second_not_ing = ['bus'];

var elements = document.getElementsByTagName('*');

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    
    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            
            var replacedText = text.replace(/[^#0-9{}\_=\/\-:%;\.'",\s][A-Za-z]\w*/g, function(a){
                var result = control(a);
                console.log(result);
                return result;
            });

            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
            }
            
        }
    }
}



function control(name){
    //app exec code here

    //Check if blank
    if(!name) return "";
    
    const nonVowels = /bcdfghjklmnpqrstvwyxz/i;

    //get syllables
    const syl = syllables(name);
    let result = [];

    //for each syllable, add a piece (arrow function?)
    syl.map(el => {
        let set = chooseSet(el);
        let rand = Math.floor(Math.random()*set.length);

        result.push(el);
        result.push(set[rand]);
    });

    result = addEnding(result);

    return result;
}

function addEnding(result){
    const last = result[result.length - 1];
    let sets = mergeArrays([second_global,second_ing,second_not_ing]);
    let rand = Math.floor(Math.random()*sets.length);

    result.push(sets[rand]);

    return result.join('');
}

function syllables(str){
    //returns array of syllables without linking consonants

    const vowels = /[aeiouAEIOU]/g;
    let cur, last = 0, match, result=[];

    while((match = vowels.exec(str)) != null){
        //Continue if vowel starts the name
        if(match.index == 0) continue;

        cur = match.index;
        result.push(str.slice(last, cur));
        last = cur + 1;
    }

    return result;
}

function chooseSet(substr){
    const last = substr[substr.length - 1];

    // Regex
    const compRe = /[bcfgkpBCKFGKP]/,
          semiCompRe = /[dtwDTW]/,
          nonCompRe = /[hjlmnrsvxyzHJLMNRSVXYZ]/;

    if(compRe.exec(last)){
        return mergeArrays([compSet, semiCompSet, nonCompSet]);
    }else if(semiCompRe.exec(last)){
        return mergeArrays([semiCompSet, nonCompSet]);
    }else if(nonCompRe.exec(last)){
        return nonCompSet;
    }else if(/[qQ]/.exec(last)){
        return qSet;
    }else{
        console.log(last);
        console.log('error in chooseset');
        return "";
    }
}

//Combines sets
function mergeArrays(arrays){
    return [].concat.apply([], arrays);
}

