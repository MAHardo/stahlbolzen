(function () {
    function $6a49e4c969cec444$export$2e2bcd8739ae039(obj, key, value) {
        if (key in obj) Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
        else obj[key] = value;
        return obj;
    }


    function $f1e9793517c51c58$export$2e2bcd8739ae039(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === 'function') ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
            ownKeys.forEach(function (key) {
                $6a49e4c969cec444$export$2e2bcd8739ae039(target, key, source[key]);
            });
        }
        return target;
    }

    const $79a03938b25da972$var$translations = {
        pl_PL: {
            startCoordsPicker: 'Uruchom zbieracza koordynat',
            stopCoordsPicker: 'Zatrzymaj zbieracza koordynat',
            exportedVillages: 'Wyeksportowane wioski',
            cannotDeleteSelectedGroup: 'Nie moÅ¼na usunÄ…Ä‡ wybranej grupy!',
            select: 'Wybierz',
            delete: 'UsuÅ„',
            add: 'Dodaj',
            save: 'Zapisz',
            groupName: 'Nazwa grupy',
            export: 'Eksport'
        },
        en_DK: {
            startCoordsPicker: 'Start coords picker',
            stopCoordsPicker: 'Stop coords picker',
            exportedVillages: 'Exported villages',
            cannotDeleteSelectedGroup: 'Cannot delete selected group!',
            select: 'Select',
            delete: 'Delete',
            add: 'Add',
            save: 'Save',
            groupName: 'Group name',
            export: 'Export'
        },
        de_DE: {
            startCoordsPicker: 'Starte Koordinaten-Selektor',
            stopCoordsPicker: 'Stoppe Koordinaten-Selektor',
            exportedVillages: 'Exportierte DÃ¶rfer',
            cannotDeleteSelectedGroup: 'Gruppe kann nicht gelÃ¶scht werden!',
            select: 'Selektieren',
            delete: 'LÃ¶schen',
            add: 'HinzufÃ¼gen',
            save: 'Speichern',
            groupName: 'Gruppen-Name',
            export: 'Exportieren'
        }
    };
    var $79a03938b25da972$export$2e2bcd8739ae039 = () => $79a03938b25da972$var$translations[window.game_data.locale] || $79a03938b25da972$var$translations.en_DK
    ;


    const $362bcac9fa8968ec$export$f92dfeb71e9bb569 = (key, d = {}) => {
        const json = localStorage.getItem(key);
        let obj = d;
        if (json) obj = JSON.parse(json);
        return obj;
    };
    const $362bcac9fa8968ec$export$8a8216c44337cd5 = (key, payload) => {
        localStorage.setItem(key, JSON.stringify(payload));
    };


    const LOCAL_STORAGE_KEY = 'kichiyaki_map_coords_picker';
    const container = document.querySelector('#content_value > h2');
    let button;
    let formsContainer;
    let actionsContainer;
    let config = $362bcac9fa8968ec$export$f92dfeb71e9bb569(LOCAL_STORAGE_KEY, {
        started: false,
        groups: {
            All: {
                villages: [],
                color: '#ffffff'
            }
        },
        selectedGroup: 'All'
    });
    let intervalID;
    const translations = $79a03938b25da972$export$2e2bcd8739ae039();
    const saveConfig = () => {
        $362bcac9fa8968ec$export$8a8216c44337cd5(LOCAL_STORAGE_KEY, config);
    };
    const getVillageIDByCoords = (x, y) => {
        const xy = parseInt(`${x}${y}`, 10);
        const village = TWMap.villages[xy];
        if (!village) return NaN;
        return village.id;
    };
    const addBorderToVillage = (x, y, color = 'transparent') => {
        const village = document.querySelector('#map_village_' + getVillageIDByCoords(x, y));
        if (village) {
            village.style.boxSizing = 'border-box';
            village.style.border = color !== 'transparent' ? `5px solid ${color}` : 'none';
        }
    };
    const addBorderToVillagesInGroup = (name, color = '') => {
        config.groups[name].villages.forEach((village) => {
            addBorderToVillage(village.x, village.y, color ? color : config.groups[name].color);
        });
    };
    const addBorderToSelectedVillages = (color = '') => {
        for (let name in config.groups) addBorderToVillagesInGroup(name, color);
    };
    const deleteVillageFromOtherGroups = (key) => {
        for (let name in config.groups) {
            if (name === config.selectedGroup) return;
            config.groups[name].villages = config.groups[name].villages.filter((village) => village.key !== key
            );
        }
    };
    const handleMapClick = (x, y, e) => {
        e.preventDefault();
        if (isNaN(getVillageIDByCoords(x, y))) return;
        const key = `${x}|${y}`;
        if (config.groups[config.selectedGroup].villages.some((village) => village.key === key
        )) {
            config.groups[config.selectedGroup].villages = config.groups[config.selectedGroup].villages.filter((village) => village.key !== key
            );
            addBorderToVillage(x, y, 'transparent');
            return;
        }
        config.groups[config.selectedGroup].villages = [
            ...config.groups[config.selectedGroup].villages,
            {
                x: x,
                y: y,
                key: key
            },
        ];
        addBorderToVillage(x, y, config.groups[config.selectedGroup].color);
        deleteVillageFromOtherGroups(key);
        saveConfig();
    };
    const renderForm = (container, group) => {
        const selected = group && group.name !== config.selectedGroup;
        const html = `
            <input type="color" value="${group ? group.color : ''}" required />
            <input type="text" required placeholder="${translations.groupName}" value="${group ? group.name : ''}" />
            <button type="submit">${group ? translations.save : translations.add}</button>
            ${group ? `<button type="button">${translations.delete}</button>` : ''}
            ${selected ? `<button class="selectButton" type="button">${translations.select}</button>` : ''}
    `;
        const form = document.createElement('form');
        form.innerHTML = html;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (group) {
                if (group.name === config.selectedGroup) config.selectedGroup = e.target[1].value;
                addBorderToVillagesInGroup(group.name, e.target[0].value);
                config.groups[e.target[1].value] = $f1e9793517c51c58$export$2e2bcd8739ae039({}, config.groups[group.name], {
                    color: e.target[0].value
                });
                if (group.name !== e.target[1].value) delete config.groups[group.name];
            } else config.groups[e.target[1].value] = {
                color: e.target[0].value,
                villages: []
            };
            renderGroups();
        });
        if (group) {
            form.querySelector('button[type="button"]').addEventListener('click', () => {
                if (config.selectedGroup === group.name) return UI.ErrorMessage(translations.cannotDeleteSelectedGroup);
                addBorderToVillagesInGroup(group.name, 'transparent');
                delete config.groups[group.name];
                form.remove();
                saveConfig();
            });
            const selectButton = form.querySelector('.selectButton');
            if (selectButton) selectButton.addEventListener('click', (e) => {
                config.selectedGroup = group.name;
                renderGroups();
            });
        }
        container.appendChild(form);
    };
    const renderGroups = () => {
        formsContainer.innerHTML = '';
        for (let name in config.groups) renderForm(formsContainer, $f1e9793517c51c58$export$2e2bcd8739ae039({}, config.groups[name], {
            name: name
        }));
        renderForm(formsContainer);
    };
    const handleExportVillages = () => {
        const groups = [];
        for (let name in config.groups) groups.push(`<div style="margin-bottom: 30px;">
      <h3>${name}</h3>
      <textarea cols=30 rows=8 readonly>${config.groups[name].villages.map((village) => village.key
        ).join(' ').trim()}</textarea>
    </div>`);
        const html = `
    ${groups.join('')}
  `;
        Dialog.show(translations.exportedVillages, html);
    };
    const renderActions = () => {
        const exportVillages = document.createElement('button');
        exportVillages.innerHTML = translations.export;
        exportVillages.addEventListener('click', handleExportVillages);
        actionsContainer.appendChild(exportVillages);
    };
    const handleSpawnSector = (data, sector) => {
        TWMap.mapHandler.__spawnSector(data, sector);
        addBorderToSelectedVillages();
    };
    const handleStart = () => {
        TWMap.map.handler.__onClick = TWMap.map.handler.onClick;
        TWMap.map.handler.onClick = handleMapClick;
        TWMap.mapHandler.__spawnSector = TWMap.map.handler.spawnSector;
        TWMap.mapHandler.spawnSector = handleSpawnSector;
        button.innerHTML = translations.stopCoordsPicker;
        renderActions();
        addBorderToSelectedVillages();
        renderGroups();
    };
    const handleStop = () => {
        if (typeof TWMap.map.handler.__onClick === 'function') TWMap.map.handler.onClick = TWMap.map.handler.__onClick;
        if (typeof TWMap.map.handler.__spawnSector === 'function') TWMap.mapHandler.spawnSector = TWMap.map.handler.__spawnSector;
        button.innerHTML = translations.startCoordsPicker;
        formsContainer.innerHTML = '';
        actionsContainer.innerHTML = '';
        addBorderToSelectedVillages('transparent');
        if (intervalID) clearInterval(intervalID);
        for (let name in config.groups) config.groups[name].villages = [];
    };
    const handleButtonClick = () => {
        if (config.started) handleStop();
        else handleStart();
        config.started = !config.started;
    };
    const renderUI = () => {
        button = document.createElement('button');
        button.style.marginLeft = '5px';
        button.innerHTML = config.started ? translations.stopCoordsPicker : translations.startCoordsPicker;
        button.addEventListener('click', handleButtonClick);
        container.appendChild(button);
        formsContainer = document.createElement('div');
        container.parentElement.insertBefore(formsContainer, container.nextSibling);
        actionsContainer = document.createElement('div');
        container.parentElement.insertBefore(actionsContainer, container.nextSibling);
        if (config.started) handleStart();
    };
    (function () {
        try {
            renderUI();
        } catch (error) {
            console.log('Map Coords Picker', error);
        }
    })();

})();
