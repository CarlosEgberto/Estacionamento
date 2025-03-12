import { atualizarMapaVagas } from './uiRendererVagas.js';
import { updateTime, toggleDarkMode, checkDarkMode } from './utilsVagas.js';

console.log('Vagas mainVagas.js carregado');

async function init() {
    console.log('Iniciando Vagas...');
    try {
        await atualizarMapaVagas();
        updateTime();

        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            console.log('Toggle Modo Escuro encontrado');
            darkModeToggle.addEventListener('change', toggleDarkMode);
        } else {
            console.error('Toggle Modo Escuro não encontrado');
        }

        checkDarkMode();
    } catch (error) {
        console.error('Erro na inicialização do Vagas:', error);
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
                resolve(); // Resolver para evitar travamento
            }
        }
    });
}

window.onload = async () => {
    console.log('Window.onload disparado');
    await waitForSupabase();
    init();
};