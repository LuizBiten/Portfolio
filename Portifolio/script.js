const startBtn = document.getElementById("startBtn");
const portfolio = document.getElementById("portfolio");

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.classList.add("hidden");

    portfolio.classList.remove("portfolio-hidden");
    portfolio.classList.add("portfolio-visible");

    setTimeout(() => {
        startBtn.remove();
    }, 400);
});

const layers = document.querySelectorAll(".rain-layer");

document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 40;
    const y = (event.clientY / window.innerHeight - 0.5) * 40;

    layers.forEach((layer, index) => {
        const depth = (index + 1) * 3;

        layer.style.marginLeft = `${x / depth}px`;
        layer.style.marginTop = `${y / depth}px`;
    });
});

const formulario = document.getElementById("meuFormulario");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

const campoCEP = document.getElementById("cep");
const campoCPF = document.getElementById("cpf");
const campoTelefone = document.getElementById("telefone");
const campoCNPJ = document.getElementById("cnpj");

function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function mascaraCEP(valor) {
    return somenteNumeros(valor)
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2");
}

function mascaraCPF(valor) {
    return somenteNumeros(valor)
        .slice(0, 11)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function mascaraTelefone(valor) {
    const numeros = somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 2) {
        return numeros ? `(${numeros}` : "";
    }

    if (numeros.length <= 6) {
        return numeros.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    if (numeros.length <= 10) {
        return numeros.replace(
            /^(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );
    }

    return numeros.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
    );
}

function mascaraCNPJ(valor) {
    return somenteNumeros(valor)
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

campoCEP.addEventListener("input", () => {
    campoCEP.value = mascaraCEP(campoCEP.value);
});

campoCPF.addEventListener("input", () => {
    campoCPF.value = mascaraCPF(campoCPF.value);
});

campoTelefone.addEventListener("input", () => {
    campoTelefone.value = mascaraTelefone(campoTelefone.value);
});

campoCNPJ.addEventListener("input", () => {
    campoCNPJ.value = mascaraCNPJ(campoCNPJ.value);
});

function cpfValido(cpf) {
    cpf = somenteNumeros(cpf);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let digito = (soma * 10) % 11;

    if (digito === 10) {
        digito = 0;
    }

    if (digito !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    digito = (soma * 10) % 11;

    if (digito === 10) {
        digito = 0;
    }

    return digito === Number(cpf[10]);
}

function cnpjValido(cnpj) {
    cnpj = somenteNumeros(cnpj);

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    function calcularDigito(base, pesos) {
        const soma = base
            .split("")
            .reduce((total, numero, indice) => {
                return total + Number(numero) * pesos[indice];
            }, 0);

        const resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }

    const base12 = cnpj.slice(0, 12);

    const digito1 = calcularDigito(
        base12,
        [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    const base13 = base12 + digito1;

    const digito2 = calcularDigito(
        base13,
        [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    return cnpj === base13 + digito2;
}

formulario.querySelectorAll("input").forEach((campo) => {
    campo.addEventListener("input", () => {
        campo.classList.remove("invalid");
        mensagemSucesso.classList.remove("visivel");
    });
});

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    mensagemSucesso.classList.remove("visivel");

    formulario.querySelectorAll("input").forEach((campo) => {
        campo.classList.remove("invalid");
    });

    let valido = true;

    function marcarInvalido(campo) {
        campo.classList.add("invalid");
        valido = false;
    }

    const cep = somenteNumeros(campoCEP.value);
    const cpf = somenteNumeros(campoCPF.value);
    const telefone = somenteNumeros(campoTelefone.value);
    const cnpj = somenteNumeros(campoCNPJ.value);

    if (cep.length !== 8) {
        marcarInvalido(campoCEP);
    }

    if (!cpfValido(cpf)) {
        marcarInvalido(campoCPF);
    }

    if (telefone.length !== 10 && telefone.length !== 11) {
        marcarInvalido(campoTelefone);
    }

    if (cnpj.length > 0 && !cnpjValido(cnpj)) {
        marcarInvalido(campoCNPJ);
    }

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    if (!valido) {
        const primeiroInvalido = formulario.querySelector(".invalid");

        if (primeiroInvalido) {
            primeiroInvalido.focus();
        }

        return;
    }

    mensagemSucesso.textContent = "Cadastro validado com sucesso!";
    mensagemSucesso.classList.add("visivel");
});
const themeToggle = document.getElementById("themeToggle");

const temaSalvo = localStorage.getItem("portfolio-theme");

if (temaSalvo === "light") {
    document.body.classList.add("light-mode");
}

function atualizarBotaoTema() {
    const modoClaro = document.body.classList.contains("light-mode");

    themeToggle.innerHTML = modoClaro ? '<img src="ideia-criativa.png" alt="Ícone de sol" class="theme-icon">' : '<img src="Apagado.png" alt="Ícone de lua" class="theme-icon">';

    themeToggle.setAttribute(
        "aria-label",
        modoClaro ? "Ativar modo escuro" : "Ativar modo claro"
    );

    themeToggle.title = modoClaro
        ? "Ativar modo escuro"
        : "Ativar modo claro";
}

atualizarBotaoTema();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const modoClaro = document.body.classList.contains("light-mode");

    localStorage.setItem(
        "portfolio-theme",
        modoClaro ? "light" : "dark"
    );

    atualizarBotaoTema();
});