// ==========================================
// 1. TRADUCCIONES
// ==========================================

const translations = {
    es: {
        title: "Bolívar Eco-Calculator",
        subtitle: "Calcula tu impacto ambiental y mejora tus hábitos.",
        languageLabel: "Idioma:",
        formTitle: "Calculadora ecológica",
        transportLabel: "¿Cómo te transportas al colegio?",
        selectOption: "Selecciona una opción",
        bus: "Bus",
        privateCar: "Carro privado",
        sharedCar: "Carro compartido",
        sustainable: "Bicicleta o caminando",
        paperLabel: "¿Cuántas hojas de papel utilizas al día?",
        recyclingLabel: "¿Cuál es tu nivel de reciclaje?",
        low: "Bajo",
        medium: "Medio",
        high: "Alto",
        calculate: "Calcular impacto",
        resultsTitle: "Tus resultados",
        co2Title: "Huella de carbono semanal",
        ecoTitle: "Eco-Points",
        printButton: "Imprimir certificado",
        pdfButton: "Guardar como PDF",
        certificateTitle: "Certificado de Impacto Ambiental",
        certificateSubtitle: "Bolívar Eco-Calculator",
        certificateRecognition: "¡Felicitaciones por participar en el cuidado del planeta!",
        habitsTitle: "Tus hábitos ambientales",
        dateLabel: "Fecha de generación:",
        certificateFooter: "Cada acción cuenta. ¡Sigamos cuidando nuestro planeta!",
        footer: "Bolívar Eco-Calculator | Educación ambiental",
        excellent: "¡Excelente! Tus hábitos contribuyen positivamente al planeta.",
        good: "¡Buen trabajo! Estás desarrollando hábitos ambientales responsables.",
        progress: "¡Vas por buen camino! Puedes mejorar algunos hábitos.",
        improve: "Puedes mejorar tus hábitos para reducir tu impacto ambiental.",
        validation: "Por favor, completa todos los campos correctamente.",
        calculating: "Cálculo realizado correctamente.",
        generatingPDF: "Generando tu archivo PDF...",
        pdfSuccess: "Tu certificado PDF se ha descargado correctamente.",
        pdfError: "No fue posible generar el PDF. Inténtalo nuevamente.",
        pdfUnavailable: "No se pudo cargar la biblioteca PDF. Recarga la página.",
        paperUnit: "hojas al día",
        kgUnit: "kg CO₂e"
    },

    en: {
        title: "Bolívar Eco-Calculator",
        subtitle: "Calculate your environmental impact and improve your habits.",
        languageLabel: "Language:",
        formTitle: "Eco Calculator",
        transportLabel: "How do you travel to school?",
        selectOption: "Select an option",
        bus: "Bus",
        privateCar: "Private car",
        sharedCar: "Carpool",
        sustainable: "Bicycle or walking",
        paperLabel: "How many sheets of paper do you use per day?",
        recyclingLabel: "What is your recycling level?",
        low: "Low",
        medium: "Medium",
        high: "High",
        calculate: "Calculate impact",
        resultsTitle: "Your results",
        co2Title: "Weekly carbon footprint",
        ecoTitle: "Eco-Points",
        printButton: "Print certificate",
        pdfButton: "Save as PDF",
        certificateTitle: "Environmental Impact Certificate",
        certificateSubtitle: "Bolívar Eco-Calculator",
        certificateRecognition: "Congratulations on participating in protecting our planet!",
        habitsTitle: "Your environmental habits",
        dateLabel: "Generation date:",
        certificateFooter: "Every action counts. Let's keep protecting our planet!",
        footer: "Bolívar Eco-Calculator | Environmental education",
        excellent: "Excellent! Your habits contribute positively to the planet.",
        good: "Great job! You are developing responsible environmental habits.",
        progress: "You are on the right track! You can improve some habits.",
        improve: "You can improve your habits to reduce your environmental impact.",
        validation: "Please complete all fields correctly.",
        calculating: "Calculation completed successfully.",
        generatingPDF: "Generating your PDF file...",
        pdfSuccess: "Your PDF certificate has been downloaded successfully.",
        pdfError: "The PDF could not be generated. Please try again.",
        pdfUnavailable: "The PDF library could not be loaded. Reload the page.",
        paperUnit: "sheets per day",
        kgUnit: "kg CO₂e"
    }
};


// ==========================================
// 2. ELEMENTOS DEL DOM
// ==========================================

const ecoForm = document.getElementById("ecoForm");
const transporteInput = document.getElementById("transporte");
const papelInput = document.getElementById("papel");
const reciclajeInput = document.getElementById("reciclaje");

const mensaje = document.getElementById("mensaje");
const resultados = document.getElementById("resultados");

const co2Resultado = document.getElementById("co2Resultado");
const ecoResultado = document.getElementById("ecoResultado");
const interpretacion = document.getElementById("interpretacion");

const languageSelect = document.getElementById("languageSelect");

const printCertificateButton =
    document.getElementById("printCertificateButton");

const savePdfButton =
    document.getElementById("savePdfButton");

const certificate =
    document.getElementById("certificate");

let currentLanguage = "es";
let lastCalculation = null;


// ==========================================
// 3. FACTORES AMBIENTALES
// ==========================================

const factoresTransporte = {
    bus: 0.08,
    privado: 0.19,
    compartido: 0.095,
    sostenible: 0
};

const factorPapel = 0.005;
const distanciaDiaria = 10;
const diasSemana = 5;

const reduccionReciclaje = {
    bajo: 0,
    medio: 0.10,
    alto: 0.20
};

const puntosTransporte = {
    sostenible: 40,
    compartido: 30,
    bus: 25,
    privado: 10
};

const puntosReciclaje = {
    bajo: 5,
    medio: 20,
    alto: 30
};


// ==========================================
// 4. IDIOMA
// ==========================================

function translate(key) {
    return translations[currentLanguage][key] || key;
}

function applyLanguage(language) {

    currentLanguage = language;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });

    if (lastCalculation) {
        updateResultsDisplay();
        updateCertificate();
    }

    mensaje.textContent = "";
}

languageSelect.addEventListener("change", event => {
    applyLanguage(event.target.value);
});


// ==========================================
// 5. CÁLCULO DE CO₂
// ==========================================

function calcularCO2(transporte, hojas, reciclaje) {

    const co2Transporte =
        factoresTransporte[transporte] *
        distanciaDiaria *
        diasSemana;

    const co2Papel =
        hojas *
        diasSemana *
        factorPapel *
        (1 - reduccionReciclaje[reciclaje]);

    return co2Transporte + co2Papel;
}


// ==========================================
// 6. CÁLCULO DE ECO-POINTS
// ==========================================

function calcularEcoPoints(transporte, hojas, reciclaje) {

    const puntosTransporteTotal =
        puntosTransporte[transporte];

    let puntosPapel;

    if (hojas <= 5) {
        puntosPapel = 30;
    } else if (hojas <= 10) {
        puntosPapel = 24;
    } else if (hojas <= 20) {
        puntosPapel = 15;
    } else {
        puntosPapel = 5;
    }

    return puntosTransporteTotal +
        puntosPapel +
        puntosReciclaje[reciclaje];
}


// ==========================================
// 7. INTERPRETACIÓN
// ==========================================

function obtenerInterpretacion(puntos) {

    if (puntos >= 80) {
        return translate("excellent");
    }

    if (puntos >= 60) {
        return translate("good");
    }

    if (puntos >= 40) {
        return translate("progress");
    }

    return translate("improve");
}


// ==========================================
// 8. FORMATO DE NÚMEROS
// ==========================================

function formatNumber(number) {

    return new Intl.NumberFormat(
        currentLanguage === "es" ? "es-CO" : "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(number);
}


// ==========================================
// 9. ACTUALIZAR RESULTADOS
// ==========================================

function updateResultsDisplay() {

    if (!lastCalculation) return;

    co2Resultado.textContent =
        `${formatNumber(lastCalculation.co2)} ${translate("kgUnit")}`;

    ecoResultado.textContent =
        `${lastCalculation.ecoPoints} / 100`;

    interpretacion.textContent =
        obtenerInterpretacion(lastCalculation.ecoPoints);
}


// ==========================================
// 10. ACTUALIZAR CERTIFICADO
// ==========================================

function updateCertificate() {

    if (!lastCalculation) return;

    const data = lastCalculation;

    document.getElementById("certificateCO2").textContent =
        `${formatNumber(data.co2)} ${translate("kgUnit")}`;

    document.getElementById("certificateEco").textContent =
        `${data.ecoPoints} / 100`;

    document.getElementById("certificateTransport").textContent =
        translate(data.transporte);

    document.getElementById("certificatePaper").textContent =
        `${data.hojas} ${translate("paperUnit")}`;

    document.getElementById("certificateRecycling").textContent =
        translate(data.reciclaje);

    document.getElementById("certificateMessage").textContent =
        obtenerInterpretacion(data.ecoPoints);

    const locale = currentLanguage === "es" ? "es-CO" : "en-US";

    document.getElementById("certificateDate").textContent =
        new Date().toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}


// ==========================================
// 11. PROCESAR FORMULARIO
// ==========================================

ecoForm.addEventListener("submit", event => {

    event.preventDefault();

    const transporte = transporteInput.value;
    const hojas = Number(papelInput.value);
    const reciclaje = reciclajeInput.value;

    if (
        !transporte ||
        !reciclaje ||
        papelInput.value.trim() === "" ||
        !Number.isInteger(hojas) ||
        hojas < 0 ||
        hojas > 1000
    ) {
        mensaje.textContent = translate("validation");
        return;
    }

    const co2 = calcularCO2(transporte, hojas, reciclaje);

    const ecoPoints =
        calcularEcoPoints(transporte, hojas, reciclaje);

    lastCalculation = {
        transporte,
        hojas,
        reciclaje,
        co2,
        ecoPoints
    };

    updateResultsDisplay();
    updateCertificate();

    resultados.hidden = false;

    printCertificateButton.disabled = false;
    savePdfButton.disabled = false;

    mensaje.textContent = translate("calculating");
});


// ==========================================
// 12. IMPRIMIR CERTIFICADO
// ==========================================

function printCertificate() {

    if (!lastCalculation) return;

    updateCertificate();

    // Abre el diálogo de impresión.
    window.print();
}

printCertificateButton.addEventListener(
    "click",
    printCertificate
);


// ==========================================
// 13. GENERAR Y DESCARGAR PDF
// ==========================================

async function saveCertificateAsPDF() {

    if (!lastCalculation) return;

    if (typeof html2pdf === "undefined") {
        mensaje.textContent = translate("pdfUnavailable");
        return;
    }

    savePdfButton.disabled = true;
    savePdfButton.textContent = translate("generatingPDF");

    mensaje.textContent = translate("generatingPDF");

    let temporaryWrapper = null;

    try {

        // Actualizar todos los datos antes de copiar.
        updateCertificate();

        // Esperar a que el navegador termine de actualizar el DOM.
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Crear una copia independiente del certificado.
        const certificateCopy = certificate.cloneNode(true);

        // Evitar que la copia herede el display:none del certificado original.
        certificateCopy.classList.add("pdf-export-copy");

        // Crear un contenedor temporal.
        temporaryWrapper = document.createElement("div");
        temporaryWrapper.className = "pdf-export-wrapper";

        temporaryWrapper.appendChild(certificateCopy);
        document.body.appendChild(temporaryWrapper);

        // Esperar a que el navegador calcule los estilos.
        await new Promise(resolve => requestAnimationFrame(resolve));

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Opciones de generación del PDF.
        const options = {
            margin: [10, 10, 10, 10],

            filename: "Bolivar-Eco-Calculator-Certificado.pdf",

            image: {
                type: "jpeg",
                quality: 0.98
            },

            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1000
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            },

            pagebreak: {
                mode: ["css", "legacy"],
                avoid: [
                    ".certificate-result",
                    ".certificate-footer"
                ]
            }
        };

        // Generar y descargar el PDF.
        // No utiliza window.print().
        await html2pdf()
            .set(options)
            .from(certificateCopy)
            .save();

        mensaje.textContent = translate("pdfSuccess");

    } catch (error) {

        console.error("Error al generar el PDF:", error);

        mensaje.textContent = translate("pdfError");

    } finally {

        // Eliminar la copia temporal.
        if (temporaryWrapper && temporaryWrapper.parentNode) {
            temporaryWrapper.parentNode.removeChild(temporaryWrapper);
        }

        savePdfButton.disabled = false;
        savePdfButton.textContent = translate("pdfButton");
    }
}

savePdfButton.addEventListener(
    "click",
    saveCertificateAsPDF
);


// ==========================================
// 14. INICIALIZACIÓN
// ==========================================

applyLanguage("es");