
// =============================
// Breadfast RMS Helper Extension v2.0
// Password: asd123
// =============================

(function() {
    'use strict';

    if (window.breadfastHelperInjected) return;
    window.breadfastHelperInjected = true;

    const CORRECT_PASSWORD = "asd123";
    let isAuthenticated = false;

    const branchMap = {
        "Heliopolis": "حضور عميل فرع مصر الجديدة",
        "Maadi": "حضور عميل فرع المعادي",
        "Agouza": "حضور عميل فرع المهندسين",
        "Downtown": "حضور عميل فرع طلعت حرب",
    };

    const paymentMap = {
        "نقدي": "كاش",
        "نقدا": "كاش",
        "نقدًا": "كاش",
        "بطاقة ائتمان": "فيزا",
        "بطاقة الائتمان": "فيزا",
        "credit card": "فيزا",
        "cash": "كاش",
    };

    // Show password modal
    function showPasswordModal() {
        return new Promise((resolve) => {
            const existing = document.getElementById('bf-password-modal');
            if (existing) return;

            const modal = document.createElement('div');
            modal.id = 'bf-password-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6);
                display: flex; align-items: center; justify-content: center;
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, sans-serif;
            `;
            modal.innerHTML = `
                <div style="
                    background: white; padding: 30px; border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3); text-align: center;
                    min-width: 300px; direction: rtl;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #e91e63; font-size: 18px;">
                        🔐 Breadfast Helper
                    </h3>
                    <p style="color: #666; margin-bottom: 15px; font-size: 14px;">
                        أدخل كلمة المرور لتفعيل الاختصارات
                    </p>
                    <input type="password" id="bf-pass-input" placeholder="كلمة المرور" style="
                        width: 100%; padding: 10px; border: 2px solid #ddd;
                        border-radius: 8px; font-size: 14px; margin-bottom: 15px;
                        box-sizing: border-box; text-align: center;
                    " autofocus>
                    <button id="bf-pass-btn" style="
                        width: 100%; padding: 10px; background: #e91e63;
                        color: white; border: none; border-radius: 8px;
                        font-size: 14px; cursor: pointer; font-weight: bold;
                    ">تفعيل</button>
                    <p id="bf-pass-error" style="color: #f44336; margin-top: 10px; font-size: 13px; display: none;">
                        ❌ كلمة المرور غير صحيحة
                    </p>
                </div>
            `;
            document.body.appendChild(modal);

            const input = document.getElementById('bf-pass-input');
            const btn = document.getElementById('bf-pass-btn');
            const error = document.getElementById('bf-pass-error');

            function checkPassword() {
                if (input.value === CORRECT_PASSWORD) {
                    isAuthenticated = true;
                    modal.remove();
                    showToast('✅ تم التفعيل بنجاح! الاختصارات جاهزة', 'success');
                    resolve(true);
                } else {
                    error.style.display = 'block';
                    input.style.borderColor = '#f44336';
                    input.value = '';
                    input.focus();
                }
            }

            btn.addEventListener('click', checkPassword);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkPassword();
            });
        });
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.bf-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'bf-toast';
        const colors = {
            success: '#4caf50',
            info: '#2196f3',
            error: '#f44336'
        };
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: bfSlideDown 0.3s ease;
            direction: rtl;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            white-space: nowrap;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'bfSlideUp 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes bfSlideDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes bfSlideUp {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textarea);
            return result;
        }
    }

    // ==========================================
    // FIXED: Extract from ACTIVE order panel (left sidebar)
    // ==========================================
    function getActiveOrderPanel() {
        // The order detail panel is the left sidebar that opens when clicking an order
        // It has the X button and shows order details
        // We look for the panel containing the order number heading
        const panels = document.querySelectorAll('div, aside, section');
        for (const panel of panels) {
            // Check if this panel contains an order number like #0306-XXXXXXXXX
            const text = panel.textContent || '';
            if (text.match(/#\d{4}-\d{9}/) && panel.querySelector('button, svg, [class*="close"], [class*="X"]')) {
                // Check if it's positioned on the left side (sidebar)
                const rect = panel.getBoundingClientRect();
                if (rect.left < window.innerWidth * 0.4 && rect.width < window.innerWidth * 0.5) {
                    return panel;
                }
            }
        }

        // Fallback: find any element with order number pattern that seems to be a detail panel
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            const directText = el.childNodes.length > 0 ? 
                Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('') : '';
            if (directText.match(/#\d{4}-\d{9}/)) {
                const rect = el.getBoundingClientRect();
                if (rect.left < 100 && rect.width > 200) {
                    return el.closest('div[class]') || el;
                }
            }
        }

        return null;
    }

    function extractOrderData() {
        const panel = getActiveOrderPanel();
        const data = {
            orderNumber: '',
            serialNumber: '',
            branch: '',
            paymentMethod: ''
        };

        if (!panel) {
            console.log('[Breadfast Helper] No active order panel found');
            return data;
        }

        const panelText = panel.textContent || '';
        console.log('[Breadfast Helper] Panel text:', panelText.substring(0, 500));

        // 1. Extract order number from panel (e.g., #0306-205045126)
        const orderMatch = panelText.match(/#(\d{4}-\d{9})/);
        if (orderMatch) {
            data.orderNumber = orderMatch[1];
            data.serialNumber = orderMatch[1].split('-')[1];
        }

        // 2. Extract branch from panel - look for branch names
        for (const [branchName, arabicName] of Object.entries(branchMap)) {
            if (panelText.includes(branchName)) {
                data.branch = branchName;
                break;
            }
        }

        // 3. Extract payment method from panel
        // Look for payment method in the panel specifically
        // In the UI, payment method appears under "طريقة الدفع"
        const paymentKeywords = Object.keys(paymentMap);

        // Try to find payment method near the label "طريقة الدفع"
        const allElements = panel.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            const text = el.textContent?.trim() || '';

            // Check if this element or next sibling contains payment info
            if (text === 'طريقة الدفع' || text.includes('طريقة الدفع')) {
                // Look at next siblings or parent for payment value
                let checkEl = el.nextElementSibling || el.parentElement?.nextElementSibling;
                if (!checkEl) {
                    // Try parent's next sibling
                    checkEl = el.parentElement?.parentElement?.querySelector('*');
                }

                // Also check all text in the panel for payment keywords
                for (const keyword of paymentKeywords) {
                    if (panelText.includes(keyword)) {
                        data.paymentMethod = keyword;
                        break;
                    }
                }
            }
        }

        // Fallback: just search all panel text for payment keywords
        if (!data.paymentMethod) {
            for (const keyword of paymentKeywords) {
                if (panelText.includes(keyword)) {
                    data.paymentMethod = keyword;
                    break;
                }
            }
        }

        console.log('[Breadfast Helper] Extracted:', data);
        return data;
    }

    // ==========================================
    // Keyboard shortcuts
    // ==========================================
    document.addEventListener('keydown', async (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // Alt + 1: Copy hashtag with order prefix
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            if (!isAuthenticated) { await showPasswordModal(); if (!isAuthenticated) return; }

            const data = extractOrderData();
            if (data.orderNumber) {
                const hashtag = '#' + data.orderNumber.split('-')[0];
                await copyToClipboard(hashtag);
                showToast(`📋 تم نسخ: ${hashtag}`, 'success');
            } else {
                showToast('❌ افتح أوردر الأول', 'error');
            }
        }

        // Alt + 2: Copy serial number
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            if (!isAuthenticated) { await showPasswordModal(); if (!isAuthenticated) return; }

            const data = extractOrderData();
            if (data.serialNumber) {
                await copyToClipboard(data.serialNumber);
                showToast(`📋 تم نسخ الرقم التسلسلي: ${data.serialNumber}`, 'success');
            } else {
                showToast('❌ افتح أوردر الأول', 'error');
            }
        }

        // Alt + 3: Copy branch attendance text
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            if (!isAuthenticated) { await showPasswordModal(); if (!isAuthenticated) return; }

            const data = extractOrderData();
            if (data.branch && branchMap[data.branch]) {
                const text = branchMap[data.branch];
                await copyToClipboard(text);
                showToast(`📋 تم نسخ: ${text}`, 'success');
            } else {
                showToast('❌ طب هوا فين الفرع!!', 'error');
            }
        }

        // Alt + 4: Copy serial + payment method
        if (e.altKey && e.key === '4') {
            e.preventDefault();
            if (!isAuthenticated) { await showPasswordModal(); if (!isAuthenticated) return; }

            const data = extractOrderData();
            if (data.serialNumber && data.paymentMethod) {
                const paymentType = paymentMap[data.paymentMethod] || data.paymentMethod;
                const text = `${data.serialNumber} ${paymentType}`;
                await copyToClipboard(text);
                showToast(`📋 تم نسخ: ${text}`, 'success');
            } else if (data.serialNumber) {
                showToast(`❌ طريقة الدفع غير واضحة في الأوردر`, 'error');
            } else {
                showToast('❌ كاش و فيزا ازاي فين الاوردر!!', 'error');
            }
        }
    });

    //setTimeout(() => {
        //showToast('🍞 Breadfast Helper v2.0 محمل! اضغط Alt+1/2/3/4', 'info');
    //}, 2000);

    console.log('[Breadfast Helper v2.0] Extension loaded. Fixed to read from active order panel.');
})();
