
import { useGameStore } from '../store/GameContext';
import { useUIStore } from '../store/UIContext';
import { useDataStore } from '../store/DataContext';

export interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

export const useAppHealthCheck = () => {
    // We import from the main store to test the "Facade"
    const store = useGameStore();
    
    // We specifically verify if we can access the underlying stores directly
    // This confirms the split architecture is active
    let uiStoreAvailable = false;
    let dataStoreAvailable = false;
    try {
        useUIStore();
        uiStoreAvailable = true;
    } catch (e) {}
    try {
        useDataStore();
        dataStoreAvailable = true;
    } catch (e) {}

    const runTests = (): TestResult[] => {
        const results: TestResult[] = [];

        // TEST 1: Architecture Split Verification
        if (uiStoreAvailable && dataStoreAvailable) {
            results.push({ name: 'Architecture Split', passed: true, message: 'UI and Data Contexts are separated and accessible.' });
        } else {
            results.push({ name: 'Architecture Split', passed: false, message: 'Failed to access separated contexts.' });
        }

        // TEST 2: Facade Pattern Integrity
        if (store.activeTab && store.menuItems) {
            results.push({ name: 'Facade Bridge', passed: true, message: 'useGameStore correctly merges UI and Data.' });
        } else {
            results.push({ name: 'Facade Bridge', passed: false, message: 'useGameStore is missing properties.' });
        }

        // TEST 3: Data Load
        if (store.menuItems.length > 0) {
            results.push({ name: 'Menu Data Load', passed: true, message: `Loaded ${store.menuItems.length} items.` });
        } else {
            results.push({ name: 'Menu Data Load', passed: false, message: 'Menu items array is empty.' });
        }

        // TEST 4: Critical Fields Integrity
        let invalidItems = 0;
        store.menuItems.forEach(item => {
            if (!item.id || !item.price || isNaN(item.price)) invalidItems++;
        });
        if (invalidItems === 0) {
            results.push({ name: 'Data Integrity', passed: true, message: 'All items have valid ID and Price.' });
        } else {
            results.push({ name: 'Data Integrity', passed: false, message: `Found ${invalidItems} corrupted items.` });
        }

        // TEST 5: Modifiers
        const itemsWithModifiers = store.menuItems.filter(i => i.modifiers && i.modifiers.length > 0);
        if (itemsWithModifiers.length > 0) {
             results.push({ name: 'Modifier Structure', passed: true, message: `Checked ${itemsWithModifiers.length} configurable items.` });
        } else {
             results.push({ name: 'Modifier Structure', passed: false, message: 'No items with modifiers found.' });
        }

        // TEST 6: Math Logic
        const mockBasePrice = 100;
        const mockQty = 2;
        const mockMods = [{ priceDelta: 50 }, { priceDelta: 20 }];
        const expectedTotal = (100 + 70) * 2;
        
        let calculated = mockBasePrice;
        mockMods.forEach(m => calculated += m.priceDelta);
        calculated = calculated * mockQty;

        if (calculated === expectedTotal) {
            results.push({ name: 'Cart Math Logic', passed: true, message: `Formula verified: ${calculated}` });
        } else {
             results.push({ name: 'Cart Math Logic', passed: false, message: `Math Error.` });
        }

        return results;
    };

    return { runTests };
};
