// 1. SELEÇÃO DOS ELEMENTOS DO DOM
const amountInput = document.querySelector("#amount");
const fromCurrencySelect = document.querySelector("#from-currency");
const toCurrencySelect = document.querySelector("#to-currency");
const convertBtn = document.querySelector("#convert-btn");

const resultContainer = document.querySelector("#result-container");
const convertedAmountElement = document.querySelector("#converted-amount");
const exchangeRateElement = document.querySelector("#exchange-rate");
const errorMessage = document.querySelector("#error-message");

// 2. FUNÇÃO PARA FORMATAR VALORES EM MOEDA LOCAL
const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
    }).format(value);
};

// 3. FUNÇÃO PARA BUSCAR A TAXA DE CÂMBIO E CONVERTER
const convertCurrency = async () => {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    // Validação para evitar valores zerados ou inválidos
    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, digite um valor válido maior que zero.");
        return;
    }

    // URL da API pública ExchangeRate-API
    const apiURL = `https://open.er-api.com/v6/latest/${fromCurrency}`;

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Erro na requisição da API");
        }

        const data = await response.json();

        // Obtém a taxa de conversão para a moeda de destino
        const rate = data.rates[toCurrency];

        if (!rate) {
            throw new Error("Taxa de câmbio não encontrada");
        }

        // Realiza o cálculo do valor convertido
        const convertedResult = amount * rate;

        // Atualiza os elementos na tela com os valores formatados
        convertedAmountElement.innerText = formatCurrency(convertedResult, toCurrency);
        exchangeRateElement.innerText = `1 ${fromCurrency} = ${formatCurrency(rate, toCurrency)}`;

        // Exibe o container de resultado e oculta mensagens de erro
        resultContainer.classList.remove("hide");
        errorMessage.classList.add("hide");

    } catch (error) {
        console.error("Erro ao converter moeda:", error);
        errorMessage.classList.remove("hide");
        resultContainer.classList.add("hide");
    }
};

// 4. EVENTOS

// Evento de clique no botão de conversão
convertBtn.addEventListener("click", convertCurrency);

// Executa uma conversão inicial assim que a página carrega
window.addEventListener("load", convertCurrency);