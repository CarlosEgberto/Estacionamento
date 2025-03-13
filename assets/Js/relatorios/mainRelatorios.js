import { loadVehicles, saveVehicles } from '../index/storageIndex.js';
import { renderListaVeiculos, filtrarListaVeiculos } from './uiRendererRelatorios.js';
import { calcularTotalArrecadado, updateTime, toggleDarkMode, checkDarkMode, ultimaEntrada } from './utilsRelatorios.js';

console.log('Relatorios mainRelatorios.js carregado');

async function clearStorage() {
    console.log('Tentando limpar registros...');
    const vehicles = await loadVehicles();
    const clearedVehicles = vehicles.map(vehicle => ({
        ...vehicle,
        historico: [],
        ativo: false
    }));
    const success = await saveVehicles(clearedVehicles);
    console.log('Registros limpos com sucesso:', success);
    return success;
}

// Função para formatar o mês e ano (ex.: "Março 2025")
function formatMonthYear(date) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function init() {
    console.log('Iniciando Relatorios...');
    try {
        // Inicializar o carrossel com o mês e ano atuais
        let currentDate = new Date(); // Março 2025, conforme a data fornecida
        const currentMonthYear = document.getElementById('currentMonthYear');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');

        // Função para atualizar o carrossel e a lista de veículos
        const updateCarousel = async () => {
            currentMonthYear.textContent = formatMonthYear(currentDate);
            await renderListaVeiculos(currentDate);
            await calcularTotalArrecadado(currentDate); // Passar o mês selecionado para calcular o total
        };

        // Inicializar o carrossel e a lista
        await updateCarousel();

        // Eventos para navegar entre os meses
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', async () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                await updateCarousel();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', async () => {
                const now = new Date();
                if (currentDate.getMonth() < now.getMonth() || currentDate.getFullYear() < now.getFullYear()) {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    await updateCarousel();
                }
            });
        }

        updateTime();

        const pesquisaPlaca = document.getElementById('pesquisaPlaca');
        const botaoApagarRegistro = document.getElementById('botaoApagarRegistro');
        const darkModeToggle = document.getElementById('darkModeToggle');

        if (pesquisaPlaca) {
            console.log('Campo de pesquisa encontrado');
            pesquisaPlaca.addEventListener('input', filtrarListaVeiculos);
        } else {
            console.error('Campo de pesquisa não encontrado');
        }

        if (botaoApagarRegistro) {
            console.log('Botão Apagar Registros encontrado');
            botaoApagarRegistro.addEventListener('click', async () => {
                console.log('Botão Apagar Registros clicado');
                if (confirm('Tem certeza de que deseja apagar todos os registros? Essa ação não pode ser desfeita.')) {
                    await clearStorage();
                    await renderListaVeiculos(currentDate);
                    await calcularTotalArrecadado(currentDate);
                } else {
                    console.log('Ação de apagar registros cancelada pelo usuário');
                }
            });
        } else {
            console.error('Botão Apagar Registros não encontrado');
        }

        if (darkModeToggle) {
            console.log('Toggle Modo Escuro encontrado');
            darkModeToggle.addEventListener('change', toggleDarkMode);
        } else {
            console.error('Toggle Modo Escuro não encontrado');
        }

        checkDarkMode();
    } catch (error) {
        console.error('Erro na inicialização do Relatorios:', error);
    }
}

function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.supabase) {
            console.log('Supabase já carregado');
            resolve();
        } else {
            console.log('Esperando Supabase carregar...');
            const supabaseScript = document.querySelector('script[src*="supabase-js"]');
            if (supabaseScript) {
                supabaseScript.addEventListener('load', () => {
                    console.log('Supabase carregado via CDN');
                    resolve();
                });
            } else {
                console.error('Script do Supabase não encontrado no DOM');
                resolve(); // Resolver mesmo assim para evitar travamento
            }
        }
    });
}

window.onload = async () => {
    console.log('Window.onload disparado');
    await waitForSupabase();
    init();
};