var category = "";
var quiz;
btnTrue = document.getElementById("true");
btnFalse = document.getElementById("false");
var perguntalAtual = 0;
var botaoclicked = 0;
// JQUERY 
$(document).ready(function functionstart() {
    // On click no botao com id "btnStart" faz a seguint e funcao
    $("#btnStart").on("click", function(e) {
        //esconde o primeiro container e display no segundo
        $(".container").hide();
        $(".container1").css("display", "flex");
        //atribui o nome inserido pelo utilizador ao campo scoreFinal.nome 
        scoreFinal.nome = document.getElementById("playerName").value;
    });
});
// A cada botao da class cat é atribuido á variavel category o valor do botao clickado
$(function() {
    $(".cat").on("click", function(e) {
        //Em qualquer botao com a class "cat" o valor desse botao é atribuido á variavel category
        category = $(this).val();
        //chamada a funçao que connecta com a api    
        dataBase();
        $(".container1").hide();
        $(".container2").css("display", "flex");
        document.getElementById("btnajuda").disabled = false;
        document.getElementById("btn5050").disabled = false;
    });
});

//atualizar tabela de classificação
if (document.readyState === "loading") {
    verify = true;
    document.addEventListener("DOMContentLoaded", updateTable);
} else {
    verify = true;
    updateTable();
}

//piscar cor quando acerta ou erra
function changeColor(num) {
    var num;
    var timeBar = document.querySelector(".time-bar-child");
    if (num == 1) {
        timeBar.style.backgroundColor = 'lightcoral';
    } else if (num == 2) {
        timeBar.style.backgroundColor = 'palegreen';
    }
    setTimeout(() => {
        timeBar.style.backgroundColor = 'rgba(0, 128, 128, 0.486)';
    }, 250);
}

//Chamar a api e igualar as variaveis dependetes ao seu valor base
async function dataBase() {
    for (var i = 0; i < btnanswer.length; i++) {
        btnanswer[i].disabled = false;
    }
    quiz = "";
    perguntalAtual = 0;
    scoreFinal.pontos = 0;
    //Conexao com a api em funçao da category escolhida anterirormente pelo utilizador
    var response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=" + category
    );

    quiz = await response.json();
    // debugging
    console.log(quiz);
    //Chamar a proxima pergunta(1ª pergunta no caso)
    proximaPergunta();

}

// Verificaçao da pergunta se é boolean ou escolha multipla
function proximaPergunta() {
    // Recomeçar o timer
    clearInterval(timercontador);
    timer();
    // Barra que funciona de Timer
    document.getElementById("timer").classList.remove("time-bar-child");
    //Mostrar os pontos atuais
    document.getElementById("showpontos").innerHTML = scoreFinal.pontos;
    document.getElementById("shownome").innerHTML = scoreFinal.nome;
    //Repete ate chegar ás 10 perguntas
    if (perguntalAtual < 10) {
        if (quiz.results[perguntalAtual].type == "boolean") {
            trueFalse();
        } else if (quiz.results[perguntalAtual].type == "multiple") {
            quizMultiple();
        }
    } else {
        //Depois das 10 perguntas chama a funçao fim de jogo
        fimJogo();
        for (var i = 0; i < btnanswer.length; i++) {
            btnanswer[i].disabled = true;
        }
    }
    document.getElementById("timer").classList.add("time-bar-child");
    document.getElementById("showPublic").style.display = "none";
}

//Funçao de perguntas true ou false 
// Baralhamento auto-incrementado sem necessidade de randomizar
function trueFalse() {
    $(".answer").hide();
    $(".boolean").show();
    document.getElementById("btn5050").display = "none";
    //atribuir a pergunta ao respetivo campo
    document.getElementById("question").innerHTML = quiz.results[perguntalAtual].question;
    //atribuir a resposta ao respetivo campo, Fazendo com que a opçao true fique sempre na msm posiçao independetemente se é a correta
    if (quiz.results[perguntalAtual].correct_answer == "True") {
        document.getElementById("true").innerHTML = quiz.results[perguntalAtual].correct_answer;
        document.getElementById("false").innerHTML = quiz.results[perguntalAtual].incorrect_answers[0];
    } else {
        document.getElementById("true").innerHTML = quiz.results[perguntalAtual].incorrect_answers[0];
        document.getElementById("false").innerHTML = quiz.results[perguntalAtual].correct_answer;
    }
}
// Caso o jogador escolha true
btnTrue.addEventListener("click", escolhaTrue);

function escolhaTrue() {
    if (quiz.results[perguntalAtual].correct_answer == "True") {
        console.log("Acertou Miseravi");
        changeColor(2);
        // Incrementar pontos
        scoreFinal.pontos += 10;
    } else {
        console.log("Errooooou");
        changeColor(1);
    }
    //Avançar para a proxima pergunta
    perguntalAtual++;
    proximaPergunta();
}
// Caso o jogador escolha False
btnFalse.addEventListener("click", escolhaFalse);

function escolhaFalse() {
    if (quiz.results[perguntalAtual].correct_answer == "False") {
        console.log("Acertou");
        scoreFinal.pontos += 10;
        changeColor(2);
    } else {
        console.log("Errooooou");
        changeColor(1);

    }
    perguntalAtual++;
    proximaPergunta();
}

// VARIAVEL COM TODOS OS BOTOES DE CLASS ANSWER PARA A QUESTAO DE RANDOMIZAR AS RESPOSTAS
var btnanswer = document.getElementsByClassName("answer");
var e = "";

function quizMultiple() {
    $(".boolean").hide();
    $(".answer").show();
    //atribuir a pergunta ao respetivo campo
    document.getElementById("question").innerHTML = quiz.results[perguntalAtual].question;
    // Juntar todas as respostas num array
    var arr = [
        quiz.results[perguntalAtual].correct_answer,
        quiz.results[perguntalAtual].incorrect_answers[0],
        quiz.results[perguntalAtual].incorrect_answers[1],
        quiz.results[perguntalAtual].incorrect_answers[2],
    ];
    // randomizar as respostas 
    let random;
    for (var i = 0; i < 4; i++) {
        random = Math.floor(Math.random() * arr.length);
        // atribuir cada resposta a um botao
        // O splice usa o numero random gerado para dar display na informaçao do botao e elimina este numero do array 
        btnanswer[i].innerHTML = arr.splice(random, 1);
        if (btnanswer[i].innerText == quiz.results[perguntalAtual].correct_answer) {
            // registar a opçao correta numa variavel global
            index = i;
        }
    }
}
//Atribuir uma funçao quando cada botao é clickado com uma variavel para guardar qual botao foi clickado
btnanswer[0].addEventListener("click", () => {
    botaoclicked = 0;
    verificaResposta();
});
btnanswer[1].addEventListener("click", () => {
    botaoclicked = 1;
    verificaResposta();
});
btnanswer[2].addEventListener("click", () => {
    botaoclicked = 2;
    verificaResposta();
});
btnanswer[3].addEventListener("click", () => {
    botaoclicked = 3;
    verificaResposta();
});

function verificaResposta() {
    //Vericaçao se a resposta escolhida está correta 
    if (btnanswer[botaoclicked].innerText == quiz.results[perguntalAtual].correct_answer) {
        console.log("Acertou multiple");
        //A cada resposta o jogador ganha 10 pontos
        scoreFinal.pontos += 10;
        changeColor(2);
    } else {
        console.log("Errou multiple");
        changeColor(1);
    }
    //Estando a resposta correta ou nao avança para a proxima pergunta
    perguntalAtual++;
    proximaPergunta();
}

var verify;
//Funçao para o fim do jogo que entre outros para o timer
function fimJogo() {
    //Debugging ** console.log(scoreFinal.pontos);
    // Condiçao - Se os pontos atuais forem superiores ao maxScore anterior o maxScore fica com os pontos atuais 
    if (scoreFinal.pontos > highscore.maxScore || highscore.category != quiz.results[0].category) {
        highscore.maxScore = scoreFinal.pontos;
        highscore.nome = scoreFinal.nome;
        highscore.category = quiz.results[0].category;
        window.localStorage.setItem(highscore.nome, JSON.stringify(highscore));
        verify = true;
        updateTable();
    } else {
        verify = false;
    }

    console.log("verify: ", verify);
    console.log("categoria: ", highscore.category);
    console.log("localstorage: ", JSON.parse(window.localStorage.getItem(scoreFinal.nome)).category);

    // Delay de 1 segundo a esconder o container 
    setTimeout(() => {
        $(".container2").hide();
        $(".container1").css("display", "flex");
    }, 1000);
    // Para o contador no fim do jogo
    clearInterval(timercontador);

}

//atualizar a tabela de classificação
function updateTable() {
    window.localStorage.setItem(highscore.nome, JSON.stringify(highscore));
    if (verify == true) {
        var newScore = document.createElement("div");
        newScore.setAttribute("class", "caps2");
        let nomeNewScore = document.createElement("h2");
        let pontosNewScore = document.createElement("h2");
        let categoryNewScore = document.createElement("h2");
        if (highscore.nome == JSON.parse(window.localStorage.getItem(scoreFinal.nome)).nome) {
            nomeNewScore.innerText = highscore.nome;
            pontosNewScore.innerText = highscore.maxScore;
            categoryNewScore.innerText = highscore.category;
        } else {

            newScore.setAttribute("class", "caps2");

            nomeNewScore.innerText = highscore.nome;
            console.log(highscore.maxScore);

            pontosNewScore.innerText = highscore.maxScore;

            categoryNewScore.innerText = highscore.category;
        }

        document.querySelector(".classificacao").appendChild(newScore);
        newScore.appendChild(nomeNewScore);
        newScore.appendChild(pontosNewScore);
        newScore.appendChild(categoryNewScore);
    }
}

//Contador
var timeleft;
var timercontador;

function timer() {
    //timer de 20 segundos, so para ter aquela pressão básica
    timeleft = 20;
    timercontador = setInterval(function() {
        if (timeleft <= 0) {
            clearInterval(timercontador);
            perguntalAtual++;
            proximaPergunta();
        }
        timeleft--;
    }, 1000);
}

//Objeto Jogador , com os seus atribuitos
var scoreFinal = {
    nome: "",
    pontos: 0,
};

var highscore = {
    nome: "Tiago",
    maxScore: 40,
    category: "Entertainment: Books"
};

// Botao de Ajuda do Publico , randomiza um numero de 50 ate 97 e diz que "x" percentagem de pessoas escolheu a opçao correta
btnajuda = document.getElementById("btnajuda");
btnajuda.addEventListener("click", ajudaPublico);

function ajudaPublico() {
    let ajuda;
    ajuda = Math.floor(Math.random() * 47) + 50;
    document.getElementById("showPublic").style.display = "block";
    document.getElementById("showPublic").innerHTML = ajuda + "% do publico respondeu " + quiz.results[perguntalAtual].correct_answer;
    console.log(ajuda + "% do publico respondeu " + quiz.results[perguntalAtual].correct_answer);
    document.getElementById("btnajuda").disabled = true;
}



// Botao para eliminar duas respostas erradas
btn5050 = document.getElementById("btn5050");
btn5050.addEventListener("click", ajuda5050);

function ajuda5050() {
    var nums = new Set();
    while (nums.size !== 2) {
        let n = Math.floor(Math.random() * 3);
        if (n != index) {
            nums.add(n);
        }
    }
    for (var elem of nums) {
        btnanswer[elem].style.display = "none";
    }
    document.getElementById("btn5050").disabled = true;
}


btnExit = document.getElementById("btnExit");
btnExit.addEventListener("click", () => {
    document.querySelector(".container3").style.display = "none";
    document.querySelector(".container1").style.display = "flex";
});

btnHigh = document.getElementById("btnHigh");
btnHigh.addEventListener("click", () => {
    document.querySelector(".container1").style.display = "none";
    document.querySelector(".container3").style.display = "flex";
});