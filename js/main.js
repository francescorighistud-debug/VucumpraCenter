document.addEventListener('DOMContentLoaded', () => {
    
    // --- Partner Modal Logic ---
    const partners = document.querySelectorAll('.partner-card');
    const modal = document.getElementById('partnerModal');
    
    if (partners.length > 0 && modal) {
        const closeModalBtn = document.getElementById('closeModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalLogo = document.getElementById('modalLogo');
        const modalDocs = document.getElementById('modalDocs');

        // Dati Reali Partner (Cartelle, Email, e Documenti specifici)
        const partnerData = {
            "La Fabbrica del Gusto": {
                folder: "La Fabbrica del Gusto",
                fattura: null,
                ddt: "fabbrica_del_gusto_DDT.pdf"
            },
            "Naturalia s.r.l": {
                folder: "Naturalia",
                fattura: null,
                ddt: "naturalia_DDT.pdf"
            },
            "Hermes Trasporti s.r.l": {
                folder: "Hermes",
                fattura: "hermes_fattura.pdf",
                ddt: null
            },
            "Ristorante Sapori di Romagna": {
                folder: "Sapori Di Romagna",
                fattura: "sapori_romagna_fattura.pdf",
                ddt: "sapori_romagna_DDT.pdf"
            }
        };

        // Open Modal
        partners.forEach(partner => {
            partner.addEventListener('click', () => {
                const name = partner.getAttribute('data-name');
                const desc = partner.getAttribute('data-desc');
                const logoText = partner.querySelector('.partner-logo').innerText;

                modalTitle.innerText = name;
                modalDesc.innerText = desc;
                modalLogo.innerText = logoText;

                // Determina Acquisti o Vendite
                const isVendite = (name === "Naturalia s.r.l" || name === "La Fabbrica del Gusto");
                const tipologiaTesto = isVendite ? "VENDITE" : "ACQUISTI";
                const tipologiaBg = isVendite ? "var(--secondary)" : "var(--primary)";
                const tipologiaColor = isVendite ? "var(--text-dark)" : "white";

                // Clear previous docs and reset grid to column inline
                modalDocs.innerHTML = `
                    <div style="background: ${tipologiaBg}; color: ${tipologiaColor}; padding: 0.75rem 1rem; border-radius: 8px; font-weight: bold; text-align: center; font-size: 1.1rem; box-shadow: var(--shadow-sm);">
                        📦 TIPOLOGIA: ${tipologiaTesto}
                    </div>
                `;
                modalDocs.style.display = 'flex';
                modalDocs.style.flexDirection = 'column';
                modalDocs.style.gap = '2rem';

                // Get specific partner data
                const pData = partnerData[name];
                if (!pData) return; // Salvaguardia

                const folder = pData.folder;

                // Inject emails top-down dynamically seeking for screen[1...N].png
                const maxScreens = 25; // Limite capiente
                for(let i = 1; i <= maxScreens; i++) {
                    const emailTitle = `screen${i}.png`;
                    const docEl = document.createElement('div');
                    docEl.style.border = '1px solid var(--border)';
                    docEl.style.borderRadius = '8px';
                    docEl.style.overflow = 'hidden';
                    docEl.style.boxShadow = 'var(--shadow-sm)';
                    docEl.style.display = 'none'; // Nasconde se non carica
                    
                    const header = document.createElement('div');
                    header.style.background = 'var(--bg-color)';
                    header.style.padding = '0.75rem 1rem';
                    header.style.borderBottom = '1px solid var(--border)';
                    header.style.fontWeight = '600';
                    header.style.color = 'var(--primary-dark)';
                    header.innerText = `📧 ${emailTitle}`;

                    const img = new Image();
                    img.style.width = '100%';
                    img.style.display = 'block';
                    img.style.objectFit = 'cover';
                    img.style.objectPosition = 'top';
                    img.style.background = '#eee';
                    
                    img.onload = () => {
                        docEl.style.display = 'block'; // Rivela il blocco div se l'immagine è trovata!
                    };
                    img.onerror = () => {
                        docEl.remove(); // Distrugge l'elemento se fallisce la richiesta, in modo da fermarsi o pulire
                    };

                    img.src = `${folder}/${emailTitle}`; // Avvia fetch dell'immagine
                    
                    docEl.appendChild(header);
                    docEl.appendChild(img);
                    modalDocs.appendChild(docEl);
                }


                // Add Document / Invoice buttons dynamically
                const btnContainer = document.createElement('div');
                btnContainer.style.display = 'flex';
                btnContainer.style.justifyContent = 'center';
                btnContainer.style.gap = '1rem';
                btnContainer.style.flexWrap = 'wrap';
                btnContainer.style.marginTop = '1.5rem';
                
                let buttonsHTML = '';
                if (pData.fattura) {
                    buttonsHTML += `
                        <a href="${folder}/${pData.fattura}" target="_blank" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--secondary); color: var(--text-dark);">
                            🧾 Visualizza Fattura
                        </a>
                    `;
                }
                if (pData.ddt) {
                    let ddtTesto = "Documento di Trasporto";
                    if (name === "Naturalia s.r.l") {
                        ddtTesto = "Fattura/DDT";
                    }
                    buttonsHTML += `
                        <a href="${folder}/${pData.ddt}" target="_blank" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary); color: white;">
                            🚚 ${ddtTesto}
                        </a>
                    `;
                }
                
                if (buttonsHTML !== '') {
                    btnContainer.innerHTML = buttonsHTML;
                    modalDocs.appendChild(btnContainer);
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        // Close Modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        };

        closeModalBtn.addEventListener('click', closeModal);

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
