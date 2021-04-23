const tela1 = document.querySelector(".conteudo-tela1")
const tela2 = document.querySelector(".conteudo-tela2")
const tela3 = document.querySelector(".conteudo-tela3")
const carregar = document.querySelector(".tela-carregar")
const modeloQuizz = {title:"", image:"", questions:[], levels:[]};

const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
carregar.classList.toggle("escondido")
promessa.then(captarQuizzes)
promessa.catch()

let quizzes
let respostaEscolhida;
let respostaCerta;
let respostasErradas;


let dadosQuizzAtual = []
let tentativas = 0;
let acertos = 0;
let porcentagem = 0;
let flagFimQuizz;

idQuizzesSeus = localStorage.getItem("ids");



function captarQuizzes(resposta){
    const dados = resposta.data
    quizzes = [dados]
    popularQuizzes()
}

function popularQuizzes(){
    const ulTodosQuizzes = document.querySelector(".ul-todos-quizzes")
    const ulSeusQuizzes = document.querySelector(".ul-seus-quizzes")
    const criarQuizz = document.querySelector(".criar-quizzes")
    

    quizzes[0].forEach(li => {
        if( idQuizzesSeus !== null && idQuizzesSeus.includes(li.id)){
            ulSeusQuizzes.parentElement.classList.remove("escondido")
            criarQuizz.classList.add("escondido")
            ulSeusQuizzes.innerHTML += `
            <li onclick="carregarQuizz(${li.id})">
                <img src="${li.image}" alt="">
                <div class="titulo-il-quizzes">
                    ${li.title}
                </div>
            </li>`
        } else {
            ulTodosQuizzes.innerHTML += `
            <li onclick="carregarQuizz(${li.id})">
                <img src="${li.image}" alt="">
                <div class="titulo-il-quizzes">
                    ${li.title}
                </div>
            </li>`
        }
    });
    carregar.classList.toggle("escondido")
}

function acessarQuizz(){
    tela1.classList.toggle("escondido")
    tela2.classList.toggle("escondido")
    window.scroll({
        top: 0,
        left: 0,
     });
}

function criarQuizz(){
    tela1.classList.toggle("escondido")
    tela3.classList.toggle("escondido")
}

function carregarQuizz(id){
    const promessa = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`)
    carregar.classList.toggle("escondido")
    promessa.then(paginaQuizz)
    promessa.catch()
}

function paginaQuizz(resposta){
    flagFimQuizz = 0
    tentativas = 0;
    acertos = 0;
    porcentagem = 0;
    dadosQuizzAtual = resposta
    const pagina = document.querySelector(".conteudo-tela2")
    
    pagina.innerHTML = `
        <div class="topo-tela2">
            <img src="${dadosQuizzAtual.data.image}" alt="">
            <div class="titulo-quizzes-tela2">
                ${dadosQuizzAtual.data.title}
            </div>
        </div>
        <div class="perguntas-quizz">
        </div>`

    const perguntas = document.querySelector(".perguntas-quizz")
    dadosQuizzAtual.data.questions.forEach(pergunta => {
        perguntas.innerHTML += `
            <div class="pergunta-quizz">
                <div class="titulo-quizz-tela2" style="background-color:${pergunta.color};">
                    <span>${pergunta.title}</span> 
                </div>
                <div class="alternativas-respostas">
                </div>
            </div>`
        const respostas = document.querySelectorAll(".alternativas-respostas")
        pergunta.answers.sort(aleatorio).forEach(resposta => {
            respostas[respostas.length - 1].innerHTML += `
                    <div class="alternativa" onclick="escolherResposta(this)" isCorrectAnswer="${resposta.isCorrectAnswer}">
                        <img src="${resposta.image}" alt="">
                        <span class="resposta">${resposta.text}</span> 
                    </div>`
        });
    });
    if(tela2.classList.contains("escondido")){
        acessarQuizz()
    }
    carregar.classList.toggle("escondido")
}

function escolherResposta(ele){
    if (ele.classList.contains("esbranquicado") || ele === respostaEscolhida){
        return
    }
    const todasAlternativas = Array.from(ele.parentNode.children) 
    todasAlternativas.forEach(alt => {
        alt.classList.add("esbranquicado")
    });
    ele.classList.remove("esbranquicado")
    respostaEscolhida = ele
    correcao(todasAlternativas)
}

function correcao(todasAlternativas){
    respostaCerta = []
    respostasErradas = []
    todasAlternativas.forEach(comparaResposta)
    if (respostaEscolhida === respostaCerta[0]){ acertos += 1}
    tentativas += 1;
    setTimeout(scrollar, 2000)
    respostaCerta[0].classList.add("correto")
    respostasErradas.forEach(alt => {
        alt.classList.add("errado")
    });
    
}

function comparaResposta(alternativa){
    if(alternativa.getAttribute("isCorrectAnswer") === "true"){
        respostaCerta.push(alternativa)
    } else {
        respostasErradas.push(alternativa)
    }  
}

function scrollar(){
    const pergunta = document.querySelectorAll(".pergunta-quizz")
    if(tentativas < pergunta.length){
        pergunta[tentativas].scrollIntoView({block: "center", behavior: "smooth"})
    } else if (tentativas === pergunta.length && flagFimQuizz === 0){
        fimQuizz()
    }
}

function fimQuizz(){
    flagFimQuizz = 1;
    porcentagem = Math.round((acertos/tentativas)*100);
    const nivel = nivelAtingido(porcentagem)
    const perguntas = document.querySelector(".perguntas-quizz")
    perguntas.innerHTML += `
    <div class="resultado-acertos escondido">
        <div class="titulo-acertos">
            <span>${porcentagem}% de acerto: ${dadosQuizzAtual.data.levels[nivel].title}</span> 
        </div>
        <div class="imagemEDescricaoAcerto">
            <img src="${dadosQuizzAtual.data.levels[nivel].image}" alt="">
            <span class="descricao-acerto">
                ${dadosQuizzAtual.data.levels[nivel].text}
            </span>
        </div>
    </div>
    <div class="finalDoQuizz escondido">
    <button class="reiniciarQuizz" onclick="reiniciar()">Reiniciar Quizz</button>
        <button class="voltarHome" onclick="acessarQuizz()">Voltar pra home</button>
    </div>
    `
    const resultado = document.querySelector(".resultado-acertos")
    const botoesFinalQuizz = document.querySelector(".finalDoQuizz")
    resultado.classList.toggle("escondido")
    botoesFinalQuizz.classList.toggle("escondido")
    resultado.scrollIntoView({block: "center", behavior: "smooth"})
}

function reiniciar(){
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
     });
    paginaQuizz(dadosQuizzAtual)

}

function nivelAtingido(porcentagem){
    const dadosAgrupados = []
    const dadosAgrupadosOriginal = []
    dadosQuizzAtual.data.levels.forEach(element => {
        dadosAgrupados.push(element["minValue"])
        dadosAgrupadosOriginal.push(element["minValue"])
    });
    dadosAgrupados.sort(numeroDescrescentes)
    const nivel = dadosAgrupados.find(element => element <= porcentagem)
    return dadosAgrupadosOriginal.indexOf(nivel)


}

function verificandoPerguntas(elemento){
    const pai = elemento.previousElementSibling;
    const lista = pai.querySelectorAll("input");

    if(pai.querySelector("input:first-child").value.length > 2/*20*/){
        modeloQuizz.title = pai.querySelector("input:first-child").value;
    }else{
        //alert("Título não válido");
        console.log("Título não válido");
    }
    
    if(testeUrl(pai.querySelector("input:nth-child(2)").value) &&
        pai.querySelector("input:nth-child(2)").value !== ""){

        modeloQuizz.image = pai.querySelector("input:nth-child(2)").value;
    }else{
        //alert("URL não válida");
        console.log("URL não válida");
    }

    if(pai.querySelector("input:nth-child(3)").value > 2){
        modeloQuizz.questions.length = pai.querySelector("input:nth-child(3)").value;
    }else{
        //alert("Número de questões não válido");
        console.log("Número de questões não válido");
    }


    if(pai.querySelector("input:last-child").value > 1){
        modeloQuizz.levels.length = pai.querySelector("input:last-child").value;
    }else{
        //alert("Número de níveis não válido");
        console.log("Número de níveis não válido");
    }


    if(modeloQuizz.title !== "" && modeloQuizz.image !== "" && modeloQuizz.questions.length > 2 && modeloQuizz.levels.length > 1){
       // popularPerguntas();
        popularNiveis();
        pai.querySelector("input:first-child").value = "";
        pai.querySelector("input:nth-child(2)").value = "";
        pai.querySelector("input:nth-child(3)").value = "";
        pai.querySelector("input:last-child").value = "";
    }
}

function popularPerguntas(){
    const esconderTela = document.querySelector(".comeca-pelo-comeco");
    const mostrarTela = document.querySelector(".criar-perguntas");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");

    mostrarTela.innerHTML = `
        <div class="texto">
            <strong>
                Crie suas perguntas
            </strong>
        </div>
    `;

    for (let i = 0; i < modeloQuizz.questions.length; i++) {
        mostrarTela.innerHTML += `
            <div class="pergunta-fechada" onclick="abrirPergunta(this)">
                <span>
                    <strong>
                        Pergunta ${i+1}
                    </strong>
                </span>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            
            <div class="perguntas escondido">
                <span class="pergunta-texto">
                    <strong>
                        Pergunta ${i+1}
                    </strong>
                </span>
                <div class="pergunta-criar-quizz">
                    <input type="text" placeholder="Texto da pergunta" minlength="20">
                    <input type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <span class="pergunta-texto">
                    <strong>
                        Resposta correta
                    </strong>
                </span>
                <div class="resposta-criar-quizz">
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                </div>
                <span class="pergunta-texto">
                    <strong>
                        Respostas incorretas
                    </strong>
                </span>
                <div class="primeira-resposta-incorreta">
                    <input type="text" placeholder="Respostas incorretas 1">
                    <input type="text" placeholder="URL da imagem 1">
                </div>
                <div class="segunda-resposta-incorreta">
                    <input type="text" placeholder="Respostas incorretas 2">
                    <input type="text" placeholder="URL da imagem 2">
                </div>
                <div class="terceira-resposta-incorreta">
                    <input type="text" placeholder="Respostas incorretas 3">
                    <input type="text" placeholder="URL da imagem 3">
                </div>
            </div>
        `;
    }
    mostrarTela.innerHTML += `
    <input class="botao-perguntas" onclick="formatarRespostas(this)" type="button" value="Prosseguir pra criar níveis">
    `;
}

function abrirPergunta(elemento){
    const pai = elemento.parentNode;
    const perguntaEscondida = elemento.nextElementSibling;
    const esconderPerguntaAberta = pai.querySelector(".pergunta-fechada.escondido");

    perguntaEscondida.scrollIntoView({block: "start", behavior: "smooth"});

    if(pai.querySelector(".pergunta-fechada.escondido") !== null){

        elemento.classList.add("escondido");
        perguntaEscondida.classList.remove("escondido");

        esconderPerguntaAberta.classList.remove("escondido");
        esconderPerguntaAberta.nextElementSibling.classList.add("escondido");

    }else{

        elemento.classList.add("escondido");
        perguntaEscondida.classList.remove("escondido");
    }    
}

function formatarRespostas(elemento){
    const todasAsPerguntas = Array.from(elemento.parentNode.querySelectorAll('.perguntas'));
    let perguntas = {title: "", color: "", answers: []};
    let respostas = {text: "", image: "", isCorrectAnswer: Boolean};
    let autorizado = true;

    for (let i = 0; i < todasAsPerguntas.length; i++) {
        let pushAutorizado = true;
        const perguntaPrincipal = todasAsPerguntas[i].querySelector(".pergunta-criar-quizz");

        if(perguntaPrincipal.querySelector("input:first-child").value.length > 1/*9*/){
            perguntas.title = perguntaPrincipal.querySelector("input:first-child").value;
        }else{
            //alert("Título da pergunta " + (i+1) + " não aceito");
            console.log("Título da pergunta " + (i+1) + " não aceito");
            autorizado = false;
            pushAutorizado = false;
        }

        if(testeHexadecimal(perguntaPrincipal.querySelector("input:last-child").value)){
            perguntas.color = perguntaPrincipal.querySelector("input:last-child").value;
        }else{
            //alert("Cor de fundo da pergunta " + (i+1) + " não aceito");
            console.log("Cor de fundo da pergunta " + (i+1) + " não aceito");
            autorizado = false;
            pushAutorizado = false;
        }

        const respostaPrincipal = todasAsPerguntas[i].querySelector(".resposta-criar-quizz");

        if(respostaPrincipal.querySelector("input:first-child").value !== "" && testeUrl(respostaPrincipal.querySelector("input:last-child").value)){
            respostas.text = respostaPrincipal.querySelector("input:first-child").value;
            respostas.image = respostaPrincipal.querySelector("input:last-child").value;
            respostas.isCorrectAnswer = true;
            perguntas.answers.push(respostas);
            respostas = {text: "", image: "", isCorrectAnswer: Boolean};
        }else{
            //alert("Resposta correta da pergunta " + [i] + " não aceita");
            console.log("Resposta correta da pergunta " + [i] + " não aceita");
            autorizado = false;
            pushAutorizado = false;
        }

        const primeiraRespostaErrada = todasAsPerguntas[i].querySelector(".primeira-resposta-incorreta");

        if(primeiraRespostaErrada.querySelector("input:first-child").value !== "" && testeUrl(primeiraRespostaErrada.querySelector("input:last-child").value)){
            respostas.text = primeiraRespostaErrada.querySelector("input:first-child").value;
            respostas.image = primeiraRespostaErrada.querySelector("input:last-child").value;
            respostas.isCorrectAnswer = false;
            perguntas.answers.push(respostas);
            respostas = {text: "", image: "", isCorrectAnswer: Boolean};
        }else{
            //alert("Primeira resposta incorreta da pergunta " + (i+1) + " não aceita");
            console.log("Primeira resposta incorreta da pergunta " + (i+1) + " não aceita");
            autorizado = false;
            pushAutorizado = false;
        }

        const segundaRespostaErrada = todasAsPerguntas[i].querySelector(".segunda-resposta-incorreta");

        if(segundaRespostaErrada.querySelector("input:first-child").value !== "" || segundaRespostaErrada.querySelector("input:last-child").value !== ""){
            if(segundaRespostaErrada.querySelector("input:first-child").value !== "" && segundaRespostaErrada.querySelector("input:last-child").value !== ""){
                if(testeUrl(segundaRespostaErrada.querySelector("input:last-child").value)){
                    respostas.text = segundaRespostaErrada.querySelector("input:first-child").value;
                    respostas.image = segundaRespostaErrada.querySelector("input:last-child").value;
                    respostas.isCorrectAnswer = false;
                    perguntas.answers.push(respostas);
                    respostas = {text: "", image: "", isCorrectAnswer: Boolean};
                }else{
                    //alert("Segunda resposta incorreta da pergunta " + (i+1) + " não válida");
                    console.log("Segunda resposta incorreta da pergunta " + (i+1) + " não válida");
                    autorizado = false;
                    pushAutorizado = false;
                }
            }else{
                //alert("Segunda resposta incorreta da pergunta " + (i+1) + " incompleta");
                console.log("Segunda resposta incorreta da pergunta " + (i+1) + " incompleta");
                autorizado = false;
                pushAutorizado = false;
            }
        }

        const terceiraRespostaErrada = todasAsPerguntas[i].querySelector(".terceira-resposta-incorreta");

        if(terceiraRespostaErrada.querySelector("input:first-child").value !== "" || terceiraRespostaErrada.querySelector("input:last-child").value !== ""){
            if(terceiraRespostaErrada.querySelector("input:first-child").value !== "" && terceiraRespostaErrada.querySelector("input:last-child").value !== ""){
                if(testeUrl(terceiraRespostaErrada.querySelector("input:last-child").value)){
                    respostas.text = terceiraRespostaErrada.querySelector("input:first-child").value;
                    respostas.image = terceiraRespostaErrada.querySelector("input:last-child").value;
                    respostas.isCorrectAnswer = false;
                    perguntas.answers.push(respostas);
                    respostas = {text: "", image: "", isCorrectAnswer: Boolean};
                }else{
                    //alert("Terceira resposta incorreta da pergunta " + (i+1) + " não válida");
                    console.log("Terceira resposta incorreta da pergunta " + (i+1) + " não válida");
                    autorizado = false;
                    pushAutorizado = false;
                }
            }else{
                //alert("Terceira resposta incorreta da pergunta " + (i+1) + " incompleta");
                console.log("Terceira resposta incorreta da pergunta " + (i+1) + " incompleta");
                autorizado = false;
                pushAutorizado = false;
            }
        }

        if(pushAutorizado){
            modeloQuizz.questions[i] = perguntas;
            console.log(modeloQuizz);
            perguntas = {title: "", color: "", answers: []};  
        }
          
    }

    if(autorizado){
        popularNiveis();
    }
}

function popularNiveis(){

    const esconderTela1 = document.querySelector(".comeca-pelo-comeco");
    esconderTela1.classList.add("escondido");

    const esconderTela = document.querySelector(".criar-perguntas");
    const mostrarTela = document.querySelector(".escolha-niveis");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");

    mostrarTela.innerHTML = `
        <div class="texto">
            <strong>
                Agora, decida os níveis
            </strong>
        </div>
    `;

    for (let i = 0; i < modeloQuizz.levels.length; i++) {
        mostrarTela.innerHTML += `
            <div class="pergunta-fechada" onclick="abrirNivel(this)">
                <span class="pergunta-texto">
                    <strong>
                        Nível ${i+1}
                    </strong>
                </span>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="perguntas escondido">
                <span class="pergunta-texto">
                    <strong>
                        Nível ${i+1}
                    </strong>
                </span>
                <div class="resposta-nivel">
                    <input type="text" placeholder="Título do nível">
                    <input type="text" placeholder="% de acerto mínima">
                    <input type="text" placeholder="URL da imagem do nível">
                    <input type="text" placeholder="Descrição do nível">
                    <textarea placeholder="Descrição do nível" cols="30" rows="10"></textarea>
                </div>
            </div>
        `;
    }

    mostrarTela.innerHTML += `
        <input class="botao-perguntas" onclick="validarNivel(this)" type="button" value="Finalizar quizz">
    `;
}

function abrirNivel(elemento){
    const nivelEscondido = elemento.nextElementSibling;
    const pai = elemento.parentNode;
    const esconderNivelAberto = pai.querySelector(".pergunta-fechada.escondido");

    if (pai.querySelector(".pergunta-fechada.escondido") !== null) {
        elemento.classList.add("escondido");
        nivelEscondido.classList.remove("escondido");

        esconderNivelAberto.classList.remove("escondido");
        esconderNivelAberto.nextElementSibling.classList.add("escondido");
    }else{
        elemento.classList.add("escondido");
        nivelEscondido.classList.remove("escondido");
    }  
}

function validarNivel(elemento) {
    const todosOsNiveis = Array.from(elemento.parentNode.querySelectorAll(".perguntas"));
    let niveis = {title: "", image: "", text: "", minValue: "" };
    let autorizado = true;
    let possuiZero = false;
    function receberFalso() {
        autorizado = false;
        nivelAutorizado = false;
    }

    for (let i = 0; i < modeloQuizz.levels.length; i++) {
        let nivelAutorizado = true;
        if(todosOsNiveis[i].querySelector(".resposta-nivel input:first-child").value.length > 9){
            niveis.title = todosOsNiveis[i].querySelector(".resposta-nivel input:first-child").value;
        }else{
            //alert("Título do Nível " + (i+1) + " é inválido");
            console.log("Título do Nível " + (i+1) + " inválido");
            receberFalso();
        }
        
        if(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value >= 0 && todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value <= 100){
            niveis.minValue = pasrseInt(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value);
            if(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value === 0){
                possuiZero = true;
            }
        }else{
            //alert("Valor do nível " + (i+1) + " é inválido");
            console.log("Valor do Nível " + (i+1) + " inválido");
            receberFalso();   
        }

        if(testeUrl(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(3)").value)){
            niveis.image = todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(3)").value;
        }else{
            //alert("Imagem do nível " + (i+1) + " é inválido");
            console.log("Imagem do Nível " + (i+1) + " é inválida");
            receberFalso();   
        }

        if (todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(4)").value === "") {
            if(todosOsNiveis[i].querySelector(".resposta-nivel textarea").value !== "" && todosOsNiveis[i].querySelector(".resposta-nivel textarea").value.length > 2/*9*/){
                niveis.text = todosOsNiveis[i].querySelector(".resposta-nivel textarea").value;
            }else{
                //alert("Descrição do nível " + (i+1) + " é inválido");
                console.log("Descrição do Nível " + (i+1) + " é inválida");
                receberFalso();
            }
            
        }else{
            if(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(4)").value.length > 2/*9*/){
                niveis.text = todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(4)").value;
            }else{
                //alert("Descrição do nível " + (i+1) + " é inválido");
                console.log("Descrição do Nível " + (i+1) + " é inválida");
                receberFalso(); 
            }
        }

        if(nivelAutorizado){
            modeloQuizz.levels[i] = niveis;
            niveis = {title: "", image: "", text: "", minValue: "" };
        }
    }

    if (autorizado) {
        const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", modeloQuizz);
        promessa.then(deuBom);
        promessa.catch(deuRuim);
    }

}

function deuRuim(valor){
    console.log(valor.response);
}

function deuBom(valor){
    console.log(valor);

}



function finalizarQuizz(){
    const esconderTela = document.querySelector(".escolha-niveis");
    const mostrarTela = document.querySelector(".quizz-pronto");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");
}

function paginaPrincipal(){
    const alterarCriacao = document.querySelector(".quizz-pronto");
    const mostrarPassoCriacao = document.querySelector(".comeca-pelo-comeco");
    
    tela1.classList.remove("escondido");
    tela3.classList.add("escondido");
    alterarCriacao.classList.add("escondido");
    mostrarPassoCriacao.classList.remove("escondido");
}

function numeroDescrescentes(a, b) {
    return b - a;
}

function aleatorio() { 
	return Math.random() - 0.5; 
}

function testeHexadecimal(hexa){
    if (hexa[0] === '#') {
        const hexasNum = hexa.substr(1);
        if(hexasNum.length === 6 && !isNaN(Number('0x' + hexasNum))){
            return true;
        }
    }else{
        return false;
    }
}
    

function testeUrl(url){
    let padraoUrl = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');
  return !!padraoUrl.test(url);
}

function adicionaLocalStorage(id){
    let idsDeserializados = [];
    const idsSerializadosEntrada = localStorage.getItem("ids")
    if(idsSerializadosEntrada !== null){
        idsDeserializados = JSON.parse(idsSerializadosEntrada);
    }
    idsDeserializados.push(id);
    const idsSerializadosSaida = JSON.stringify(idsDeserializados);
    localStorage.setItem("ids", idsSerializadosSaida)
}

