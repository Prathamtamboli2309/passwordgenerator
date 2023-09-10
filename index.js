// fetch all elements from html 

const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")
const passwordDisplay=document.querySelector('[data-passwordDisplay')
const copyBtn=document.querySelector('[data-copy]')
const copyMsg=document.querySelector('[data-copyMsg]')
const uppercaseCheck=document.querySelector('#uppercase')
const lowercaseCheck=document.querySelector('#lowercase')
const numbersCheck=document.querySelector('#numbers')
const symbolsCheck=document.querySelector('#symbol')
const indicator=document.querySelector('[data-indicator')
const generateBtn=document.querySelector('.generate-button')
const allCheckBox=document.querySelectorAll('input[type=checkbox]')
const symbols='~!@#$%^&*()_+=-[]{}\|:;"/?><,.'

// for default password length 
let password="";
let passwordLength=10;
let checkcount=0;
handleSlider()
// set circle color to grey in strength 
setIndicator('#ccc');

// set passwordlength 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const mini=inputSlider.min;
    const maxi=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-mini)*100/(maxi-mini))+"% 100% "
}
//indicator color and shadow
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInterger(min,max){
    return Math.floor( Math.random()*(max-min)) +min;
}

function generateRandomNumber(){
    return getRndInterger(0,9);
}

function generateLowercase(){
    return String.fromCharCode( getRndInterger(97,123))
}

function generateUppercase(){
    return String.fromCharCode( getRndInterger(65,91))
}

function generateSymbol(){
    const rndnum=getRndInterger(0,symbols.length)
    return symbols.charAt(rndnum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasLower && hasUpper &&(hasNum || hasSym) && passwordLength>=0){
        setIndicator('#0f0');
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength>=6
    ){
        setIndicator('#ff0');
    }else{
        setIndicator("#f00")
    }
}


async function copyContent(){
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText="Copied";
    }catch(e){
        copyMsg.innerText="Failed";
    }
    
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active")
    },2000);
}

// event listner adding 

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function handleCheckBoxChange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    })
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

function shufflePassword(shupassword){
    //fisher yates method
    for(let i=shupassword.length-1;i>0;i--){
        // random number 
        const j=Math.floor(Math.random()*(i+1));
        // swap 
        const temp=shupassword[i];
        shupassword[i]=shupassword[j];
        shupassword[j]=temp;

    }
    let str="";
    shupassword.forEach((el)=>(str+=el));
    return str;

}

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkcount==0) return ;

    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
    }
    //for new password
 console.log('hi')

    //remove old password
    password="";

    // lets put the stuff by checkbox 
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funArr=[]

    if(uppercaseCheck.checked){
        funArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowercase);
    }
    
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    
    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    // compulory addition 

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }

    // remaining addition 
    for(let i=0;i<passwordLength-funArr.length;i++){
        let rndIndex=getRndInterger(0,funArr.length);
        password+=funArr[rndIndex]();
    }

    // shuffle the password 
    password = shufflePassword(Array.from(password));

    // show in ui 
    passwordDisplay.value=password;

    // calc stength 
    calcStrength();
})  