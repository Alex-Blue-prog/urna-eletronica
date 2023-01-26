let seuVotoPara = document.querySelector(".d-1-1 span");
let cargo = document.querySelector(".d-1-2 span");
let descricao = document.querySelector(".d-1-4");
let aviso = document.querySelector(".d-2");
let lateral = document.querySelector(".d-1-right");
let numeros = document.querySelector(".d-1-3");

let etapaAtual = 0;
let numero = "";
let votobranco = false;
let votos = [];

function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let numeroHtml = "";
    numero = "";
    votobranco = false;

    for(let i = 0; i < etapa.numeros; i++) {

        if(i === 0) {
            numeroHtml += `<div class="numero pisca"></div> `
        }
        else {
            numeroHtml += `<div class="numero"></div> `
        }
    }

    seuVotoPara.style.display = "none";
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = "";
    aviso.style.display = "none";
    lateral.innerHTML = "";
    numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.find(candidato => candidato.numero === numero);

    if(candidato) {
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        descricao.innerHTML = `Nome: ${candidato.nome} <br> Partido: ${candidato.partido}`;

        let fotosHtml = "";
        for(let i in candidato.fotos) {
            fotosHtml += `
            <div class="d-1-image ${candidato.fotos[i].small ? "small" : ""} ">
                <img src="${candidato.fotos[i].url}" alt="FOTO">
                ${candidato.fotos[i].legenda}
            </div> `;
        }

        lateral.innerHTML = fotosHtml;
    } else {
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        descricao.innerHTML = `<div class="aviso--grande pisca">VOTO NULO</div>`;
    }

}

function clicou() {
    let n = this.textContent;
    let elNumero = document.querySelector(".numero.pisca");

    if(elNumero !== null) {

        numero = `${numero}${n}`;
        elNumero.innerHTML = n;
        elNumero.classList.remove("pisca");

        if(elNumero.nextElementSibling) {
            elNumero.nextElementSibling.classList.add("pisca");
        } else {
            atualizaInterface();
        }
    }

}

function branco() {
    if(etapas[etapaAtual] === undefined) return;

    if(numero === "") {
        votobranco = true;
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        numeros.innerHTML = "";
        descricao.innerHTML = `<div class="aviso--grande pisca">VOTO EM BRANCO</div>`;
    } else {
        alert("CORRIJA, antes de votar em BRANCO");
    }
}

function corrige() {
    // numero = "";
    if(etapas[etapaAtual] === undefined) return;
    comecarEtapa();
}

function confirma() {
    if(etapas[etapaAtual] === undefined) return;

    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if(votobranco === true) {
        console.log('voto em branco');
        votoConfirmado = true;

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: "branco"
        })

    } else if(numero.length === etapa.numeros) {
        console.log("voto em: ",numero);
        votoConfirmado = true;

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        })
    }

    if(votoConfirmado) {
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined) {
            // numero = "";
            comecarEtapa();
        } else {
            console.log("FIM"); console.log(votos);

            //tela final
            let div = document.createElement("div");
            div.classList.add("aviso--gigante");
            div.innerHTML = `<span class="pisca">FIM</span>`;
            document.querySelector(".tela").append(div);

            //resetar todas as etapas no final para a proxima pessoal votar
            setTimeout(() => {
                etapaAtual = 0;
                div.remove();
                comecarEtapa();

            },3000);
        }
    }
}

comecarEtapa();

//adicionar evento clicou a todos os botões númericos da votaçao
document.querySelectorAll(".teclado--botao").forEach(botao => {

    if(botao.getAttribute("onclick")) return;
    botao.addEventListener("click", clicou);
})