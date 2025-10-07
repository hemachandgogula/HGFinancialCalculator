// HG Financial Calculator - Complete Financial Planning Suite
// Developed by Hemachand Gogula
// Email: hemachandgogula@gmail.com
// LinkedIn: https://www.linkedin.com/in/hemachandgogula/
// GitHub: https://github.com/hemachandgogula

// Global variables for application state
let prepayments = [];
let groupMembers = ['Member 1', 'Member 2'];
let groupExpenses = [];
let investmentComparisons = [];
let transactionData = [];
let categoryChart = null;
let trendChart = null;

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('HG Financial Calculator initializing...');
    initializeTabs();
    initializeBillSplitter();
    initializeComparisons();
    
    // Add initial prepayment entry
    addPrepayment();
    
    // Add initial comparisons
    addComparison();
    addComparison();
    
    // Run initial calculations
    setTimeout(() => {
        calculateEMI();
        calculateSIP();
        calculateLumpsum();
        calculateCombined();
        calculateSWP();
        calculateGoal();
        calculateRetirement();
        calculateComparison();
        calculateBillSplit();
    }, 100);
    
    console.log('HG Financial Calculator initialized successfully!');
});

// Tab Management System
function initializeTabs() {
    // Main navigation tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active state from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate clicked tab
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Investment sub-tabs (SIP section)
    const invTabBtns = document.querySelectorAll('.inv-tab-btn');
    const invTabContents = document.querySelectorAll('.inv-tab-content');
    
    invTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-inv-tab');
            
            invTabBtns.forEach(b => b.classList.remove('active'));
            invTabContents.forEach(content => content.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Wealth calculator sub-tabs
    const wealthTabBtns = document.querySelectorAll('.wealth-tab-btn');
    const wealthTabContents = document.querySelectorAll('.wealth-tab-content');
    
    wealthTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-wealth-tab');
            
            wealthTabBtns.forEach(b => b.classList.remove('active'));
            wealthTabContents.forEach(content => content.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

function validateInput(value, min = 0, max = Infinity) {
    const num = parseFloat(value) || 0;
    return Math.max(min, Math.min(max, num));
}

// EMI Calculator Implementation
function calculateEMI() {
    const principal = validateInput(document.getElementById('loan-amount').value, 1);
    const annualRate = validateInput(document.getElementById('interest-rate').value, 0.1, 50);
    const years = validateInput(document.getElementById('loan-tenure').value, 1, 50);
    
    if (principal <= 0 || annualRate <= 0 || years <= 0) {
        updateEMIResults(0, 0, 0, 0);
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    
    // EMI calculation using compound interest formula
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;
    const interestPercentage = (totalInterest / principal) * 100;
    
    updateEMIResults(emi, totalAmount, totalInterest, interestPercentage);
}

function updateEMIResults(emi, total, interest, percentage) {
    document.getElementById('emi-result').textContent = formatCurrency(emi);
    document.getElementById('total-amount').textContent = formatCurrency(total);
    document.getElementById('total-interest').textContent = formatCurrency(interest);
    document.getElementById('interest-percentage').textContent = percentage.toFixed(1) + '%';
}

// Multiple Prepayments Calculator Implementation
function addPrepayment() {
    const prepaymentId = 'prepayment-' + Date.now();
    prepayments.push({
        id: prepaymentId,
        year: 2,
        amount: 100000
    });
    
    renderPrepayments();
    calculatePrepayments();
}

function removePrepayment(id) {
    prepayments = prepayments.filter(p => p.id !== id);
    renderPrepayments();
    calculatePrepayments();
}

function renderPrepayments() {
    const container = document.getElementById('prepayments-list');
    container.innerHTML = '';
    
    prepayments.forEach(prepayment => {
        const div = document.createElement('div');
        div.className = 'prepayment-item';
        div.innerHTML = `
            <div class="input-group">
                <label>Year ${prepayment.year}</label>
                <input type="number" value="${prepayment.year}" min="1" 
                       onchange="updatePrepayment('${prepayment.id}', 'year', this.value)">
            </div>
            <div class="input-group">
                <label>Amount (₹)</label>
                <input type="number" value="${prepayment.amount}" min="1000" 
                       onchange="updatePrepayment('${prepayment.id}', 'amount', this.value)">
            </div>
            <button class="remove-btn" onclick="removePrepayment('${prepayment.id}')">Remove</button>
        `;
        container.appendChild(div);
    });
}

function updatePrepayment(id, field, value) {
    const prepayment = prepayments.find(p => p.id === id);
    if (prepayment) {
        prepayment[field] = validateInput(value, field === 'year' ? 1 : 1000);
        calculatePrepayments();
    }
}

function calculatePrepayments() {
    const principal = validateInput(document.getElementById('prep-loan-amount').value, 1);
    const annualRate = validateInput(document.getElementById('prep-interest-rate').value, 0.1, 50);
    const years = validateInput(document.getElementById('prep-loan-tenure').value, 1, 50);
    const strategy = document.getElementById('prep-strategy').value;
    
    if (principal <= 0 || annualRate <= 0 || years <= 0) {
        document.getElementById('time-savings-results').innerHTML = '<p>Enter valid loan details</p>';
        document.getElementById('emi-savings-results').innerHTML = '<p>Enter valid loan details</p>';
        document.getElementById('prepayment-table-body').innerHTML = '';
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    const originalEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                       (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const originalTotalPayment = originalEMI * totalMonths;
    
    // Sort prepayments by year
    const sortedPrepayments = [...prepayments].sort((a, b) => a.year - b.year);
    const totalPrepaid = sortedPrepayments.reduce((sum, p) => sum + p.amount, 0);
    
    if (totalPrepaid >= principal) {
        const errorMsg = '<p style="color: var(--accent-red);">Total prepayments cannot exceed loan amount</p>';
        document.getElementById('time-savings-results').innerHTML = errorMsg;
        document.getElementById('emi-savings-results').innerHTML = errorMsg;
        return;
    }
    
    let newTotalPayment = 0;
    let newTenureMonths = totalMonths;
    let newEMI = originalEMI;
    
    if (strategy === 'reduce_tenure') {
        // Calculate new tenure with reduced principal
        const effectivePrincipal = principal - totalPrepaid;
        newTenureMonths = -Math.log(1 - (effectivePrincipal * monthlyRate / originalEMI)) / Math.log(1 + monthlyRate);
        newTotalPayment = originalEMI * newTenureMonths + totalPrepaid;
        
        const timeSavedMonths = totalMonths - newTenureMonths;
        const timeSavedYears = timeSavedMonths / 12;
        const interestSaved = originalTotalPayment - newTotalPayment;
        
        // Time Savings Results
        const timeSavingsHTML = generateTimeSavingsHTML(years, newTenureMonths, timeSavedYears, interestSaved);
        
        // EMI Savings Results (same EMI maintained)
        const emiSavingsHTML = generateEMISavingsHTML('Keep Same EMI', originalEMI, originalEMI, 0, 0, timeSavedYears, totalPrepaid);
        
        document.getElementById('time-savings-results').innerHTML = timeSavingsHTML;
        document.getElementById('emi-savings-results').innerHTML = emiSavingsHTML;
        
    } else { // reduce_emi
        // Calculate new EMI with reduced principal but same tenure
        const effectivePrincipal = principal - totalPrepaid;
        newEMI = (effectivePrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                 (Math.pow(1 + monthlyRate, totalMonths) - 1);
        newTotalPayment = newEMI * totalMonths + totalPrepaid;
        
        const emiReduction = originalEMI - newEMI;
        const totalEMISavings = emiReduction * totalMonths;
        const interestSaved = originalTotalPayment - newTotalPayment;
        
        // Time Savings Results (no time saved)
        const timeSavingsHTML = generateTimeSavingsHTML(years, totalMonths, 0, interestSaved);
        
        // EMI Savings Results
        const emiSavingsHTML = generateEMISavingsHTML('Reduce EMI', originalEMI, newEMI, emiReduction, totalEMISavings, 0, totalPrepaid);
        
        document.getElementById('time-savings-results').innerHTML = timeSavingsHTML;
        document.getElementById('emi-savings-results').innerHTML = emiSavingsHTML;
    }
    
    // Generate year-by-year table
    generatePrepaymentTable(principal, annualRate, years, sortedPrepayments, originalEMI);
}

function generateTimeSavingsHTML(originalYears, newTenureMonths, timeSavedYears, interestSaved) {
    return `
        <div class="result-item">
            <span class="label">Original Loan Tenure</span>
            <span class="value">${originalYears} years</span>
        </div>
        <div class="result-item">
            <span class="label">New Loan Tenure</span>
            <span class="value">${(newTenureMonths / 12).toFixed(1)} years</span>
        </div>
        <div class="result-item highlight">
            <span class="label">Time Saved</span>
            <span class="value">${timeSavedYears.toFixed(1)} years</span>
        </div>
        <div class="result-item success">
            <span class="label">Interest Saved</span>
            <span class="value">${formatCurrency(Math.max(0, interestSaved))}</span>
        </div>
    `;
}

function generateEMISavingsHTML(strategy, originalEMI, newEMI, emiReduction, totalEMISavings, timeSaved, totalPrepaid) {
    const benefit = strategy === 'Keep Same EMI' ? 
        `Loan finishes ${timeSaved.toFixed(1)} years early` :
        `₹${formatNumber(emiReduction)} less every month`;
        
    return `
        <div class="result-item">
            <span class="label">Strategy</span>
            <span class="value">${strategy}</span>
        </div>
        <div class="result-item">
            <span class="label">Original EMI</span>
            <span class="value">${formatCurrency(originalEMI)}</span>
        </div>
        <div class="result-item ${strategy !== 'Keep Same EMI' ? 'success' : ''}">
            <span class="label">New EMI</span>
            <span class="value">${formatCurrency(newEMI)}</span>
        </div>
        <div class="result-item ${emiReduction > 0 ? 'highlight' : ''}">
            <span class="label">Monthly EMI Reduction</span>
            <span class="value">${formatCurrency(emiReduction)}</span>
        </div>
        <div class="result-item">
            <span class="label">Total Prepayments</span>
            <span class="value">${formatCurrency(totalPrepaid)}</span>
        </div>
        <div class="result-item success">
            <span class="label">Benefit</span>
            <span class="value">${benefit}</span>
        </div>
    `;
}

function generatePrepaymentTable(principal, annualRate, years, prepayments, emi) {
    const tbody = document.getElementById('prepayment-table-body');
    tbody.innerHTML = '';
    
    let outstanding = principal;
    
    for (let year = 1; year <= years; year++) {
        if (outstanding <= 0) break;
        
        const yearlyInterest = outstanding * annualRate / 100;
        const yearlyPrincipal = Math.min(emi * 12 - yearlyInterest, outstanding);
        
        // Check for prepayments in this year
        const yearPrepayment = prepayments.find(p => p.year === year);
        const prepaymentAmount = yearPrepayment ? yearPrepayment.amount : 0;
        
        outstanding = Math.max(0, outstanding - yearlyPrincipal - prepaymentAmount);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Year ${year}</td>
            <td>${formatCurrency(emi)}</td>
            <td>${formatCurrency(yearlyPrincipal)}</td>
            <td>${formatCurrency(yearlyInterest)}</td>
            <td>${formatCurrency(outstanding)}</td>
            <td class="prepayment-amount">${formatCurrency(prepaymentAmount)}</td>
        `;
        
        if (prepaymentAmount > 0) {
            row.classList.add('prepayment-year');
        }
        
        tbody.appendChild(row);
    }
}

// SIP Calculator with Groww Formula Implementation
function calculateSIP() {
    const monthlyAmount = validateInput(document.getElementById('sip-amount').value, 100);
    const years = validateInput(document.getElementById('sip-period').value, 1, 50);
    const annualReturn = validateInput(document.getElementById('sip-return').value, 1, 30);
    const stepUp = validateInput(document.getElementById('sip-stepup').value, 0, 50);
    
    if (monthlyAmount <= 0 || years <= 0 || annualReturn <= 0) {
        updateSIPResults(0, 0, 0, 0);
        return;
    }
    
    // Groww SIP Formula: FV = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
    let totalInvestment = 0;
    let maturityValue = 0;
    let currentSIP = monthlyAmount;
    
    // Calculate with step-up
    for (let year = 1; year <= years; year++) {
        const yearlyInvestment = currentSIP * 12;
        totalInvestment += yearlyInvestment;
        
        // Apply Groww formula for this year's SIP
        const monthsRemaining = (years - year + 1) * 12;
        const yearlyMaturity = currentSIP * (Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate * (1 + monthlyRate);
        maturityValue += yearlyMaturity;
        
        // Apply step-up for next year
        currentSIP = currentSIP * (1 + stepUp / 100);
    }
    
    const expectedReturns = maturityValue - totalInvestment;
    const wealthMultiplier = maturityValue / totalInvestment;
    
    updateSIPResults(totalInvestment, expectedReturns, maturityValue, wealthMultiplier);
}

function updateSIPResults(investment, returns, maturity, multiplier) {
    document.getElementById('sip-total-investment').textContent = formatCurrency(investment);
    document.getElementById('sip-expected-returns').textContent = formatCurrency(returns);
    document.getElementById('sip-maturity-value').textContent = formatCurrency(maturity);
    document.getElementById('sip-multiplier').textContent = multiplier.toFixed(1) + 'x';
}

// Lumpsum Calculator Implementation
function calculateLumpsum() {
    const principal = validateInput(document.getElementById('lumpsum-amount').value, 1000);
    const years = validateInput(document.getElementById('lumpsum-period').value, 1, 50);
    const annualReturn = validateInput(document.getElementById('lumpsum-return').value, 1, 30);
    
    if (principal <= 0 || years <= 0 || annualReturn <= 0) {
        updateLumpsumResults(0, 0, 0, 0);
        return;
    }
    
    // Compound interest formula: A = P(1 + r)^t
    const maturityValue = principal * Math.pow(1 + annualReturn / 100, years);
    const totalReturns = maturityValue - principal;
    const wealthMultiplier = maturityValue / principal;
    
    updateLumpsumResults(principal, maturityValue, totalReturns, wealthMultiplier);
}

function updateLumpsumResults(initial, maturity, returns, multiplier) {
    document.getElementById('lumpsum-initial').textContent = formatCurrency(initial);
    document.getElementById('lumpsum-maturity').textContent = formatCurrency(maturity);
    document.getElementById('lumpsum-returns').textContent = formatCurrency(returns);
    document.getElementById('lumpsum-multiplier').textContent = multiplier.toFixed(1) + 'x';
}

// Combined SIP + Lumpsum Calculator Implementation
function calculateCombined() {
    const sipAmount = validateInput(document.getElementById('combined-sip-amount').value, 0);
    const lumpsumAmount = validateInput(document.getElementById('combined-lumpsum-amount').value, 0);
    const years = validateInput(document.getElementById('combined-period').value, 1, 50);
    const annualReturn = validateInput(document.getElementById('combined-return').value, 1, 30);
    
    if (years <= 0 || annualReturn <= 0 || (sipAmount <= 0 && lumpsumAmount <= 0)) {
        updateCombinedResults(0, 0, 0, 0);
        return;
    }
    
    let sipMaturity = 0;
    let sipInvestment = 0;
    
    if (sipAmount > 0) {
        // SIP calculation
        const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
        const months = years * 12;
        sipInvestment = sipAmount * months;
        sipMaturity = sipAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
    }
    
    let lumpsumMaturity = 0;
    if (lumpsumAmount > 0) {
        // Lumpsum calculation
        lumpsumMaturity = lumpsumAmount * Math.pow(1 + annualReturn / 100, years);
    }
    
    const totalInvestment = sipInvestment + lumpsumAmount;
    const totalMaturity = sipMaturity + lumpsumMaturity;
    
    updateCombinedResults(totalInvestment, sipMaturity, lumpsumMaturity, totalMaturity);
}

function updateCombinedResults(totalInvestment, sipValue, lumpsumValue, totalValue) {
    document.getElementById('combined-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('combined-sip-value').textContent = formatCurrency(sipValue);
    document.getElementById('combined-lumpsum-value').textContent = formatCurrency(lumpsumValue);
    document.getElementById('combined-total-value').textContent = formatCurrency(totalValue);
}

// SWP Calculator Implementation
function calculateSWP() {
    const investment = validateInput(document.getElementById('swp-amount').value, 10000);
    const withdrawal = validateInput(document.getElementById('swp-withdrawal').value, 100);
    const annualReturn = validateInput(document.getElementById('swp-return').value, 1, 30);
    const years = validateInput(document.getElementById('swp-period').value, 1, 50);
    
    if (investment <= 0 || withdrawal <= 0 || annualReturn <= 0 || years <= 0) {
        document.getElementById('swp-results').innerHTML = '<p>Enter valid parameters</p>';
        return;
    }
    
    const monthlyReturn = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    
    let remainingAmount = investment;
    let totalWithdrawn = 0;
    let monthsCompleted = 0;
    
    // Simulate month by month
    for (let month = 1; month <= totalMonths; month++) {
        // Apply monthly return
        remainingAmount = remainingAmount * (1 + monthlyReturn);
        
        // Check if withdrawal is possible
        if (remainingAmount >= withdrawal) {
            remainingAmount -= withdrawal;
            totalWithdrawn += withdrawal;
            monthsCompleted = month;
        } else {
            // Partial withdrawal possible
            totalWithdrawn += remainingAmount;
            remainingAmount = 0;
            monthsCompleted = month;
            break;
        }
    }
    
    const yearsCompleted = monthsCompleted / 12;
    const sustainabilityStatus = monthsCompleted >= totalMonths ? 'Sustainable ✅' : 'Not Sustainable ⚠️';
    const statusClass = monthsCompleted >= totalMonths ? 'success' : 'error';
    
    const resultsHTML = `
        <div class="result-item ${statusClass}">
            <span class="label">Sustainability</span>
            <span class="value">${sustainabilityStatus}</span>
        </div>
        <div class="result-item">
            <span class="label">Period Covered</span>
            <span class="value">${yearsCompleted.toFixed(1)} years</span>
        </div>
        <div class="result-item">
            <span class="label">Total Withdrawn</span>
            <span class="value">${formatCurrency(totalWithdrawn)}</span>
        </div>
        <div class="result-item">
            <span class="label">Remaining Amount</span>
            <span class="value">${formatCurrency(remainingAmount)}</span>
        </div>
        <div class="result-item">
            <span class="label">Monthly Withdrawal</span>
            <span class="value">${formatCurrency(withdrawal)}</span>
        </div>
    `;
    
    document.getElementById('swp-results').innerHTML = resultsHTML;
}

// Goal Planning Calculator Implementation
function calculateGoal() {
    const goalAmount = validateInput(document.getElementById('goal-amount').value, 1000);
    const timeToGoal = validateInput(document.getElementById('goal-time').value, 1, 50);
    const expectedReturn = validateInput(document.getElementById('goal-return').value, 1, 30);
    const currentSavings = validateInput(document.getElementById('goal-current').value, 0);
    
    if (goalAmount <= 0 || timeToGoal <= 0 || expectedReturn <= 0) {
        document.getElementById('goal-results').innerHTML = '<p>Enter valid goal parameters</p>';
        return;
    }
    
    // Calculate future value of current savings
    const futureValueOfSavings = currentSavings * Math.pow(1 + expectedReturn / 100, timeToGoal);
    
    // Calculate required additional amount
    const requiredAmount = goalAmount - futureValueOfSavings;
    
    if (requiredAmount <= 0) {
        const resultsHTML = `
            <div class="result-item success">
                <span class="label">Goal Status</span>
                <span class="value">Already Achievable! 🎉</span>
            </div>
            <div class="result-item">
                <span class="label">Current Savings Future Value</span>
                <span class="value">${formatCurrency(futureValueOfSavings)}</span>
            </div>
            <div class="result-item success">
                <span class="label">Surplus Amount</span>
                <span class="value">${formatCurrency(futureValueOfSavings - goalAmount)}</span>
            </div>
        `;
        document.getElementById('goal-results').innerHTML = resultsHTML;
        return;
    }
    
    // Calculate required monthly SIP
    const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const months = timeToGoal * 12;
    const requiredSIP = requiredAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) / (1 + monthlyRate);
    
    // Calculate lumpsum requirement
    const requiredLumpsum = requiredAmount / Math.pow(1 + expectedReturn / 100, timeToGoal);
    
    const resultsHTML = `
        <div class="result-item">
            <span class="label">Goal Amount</span>
            <span class="value">${formatCurrency(goalAmount)}</span>
        </div>
        <div class="result-item">
            <span class="label">Current Savings Future Value</span>
            <span class="value">${formatCurrency(futureValueOfSavings)}</span>
        </div>
        <div class="result-item">
            <span class="label">Additional Amount Needed</span>
            <span class="value">${formatCurrency(requiredAmount)}</span>
        </div>
        <div class="result-item highlight">
            <span class="label">Required Monthly SIP</span>
            <span class="value">${formatCurrency(requiredSIP)}</span>
        </div>
        <div class="result-item">
            <span class="label">OR Lumpsum Today</span>
            <span class="value">${formatCurrency(requiredLumpsum)}</span>
        </div>
    `;
    
    document.getElementById('goal-results').innerHTML = resultsHTML;
}

// Retirement Planning Calculator Implementation (Two-Phase)
function calculateRetirement() {
    const currentAge = validateInput(document.getElementById('current-age').value, 18, 80);
    const retirementAge = validateInput(document.getElementById('retirement-age').value, 25, 85);
    const monthlyIncome = validateInput(document.getElementById('retirement-income').value, 1000);
    const expectedReturn = validateInput(document.getElementById('retirement-return').value, 1, 30);
    const monthlyReturnRate = validateInput(document.getElementById('retirement-monthly-return').value, 0.1, 5);
    const retirementYears = validateInput(document.getElementById('retirement-years').value, 10, 50);
    
    if (currentAge <= 0 || retirementAge <= currentAge || monthlyIncome <= 0 || expectedReturn <= 0) {
        const errorMsg = '<p>Enter valid retirement parameters</p>';
        document.getElementById('accumulation-results').innerHTML = errorMsg;
        document.getElementById('sustainability-results').innerHTML = errorMsg;
        document.getElementById('retirement-recommendation').innerHTML = errorMsg;
        return;
    }
    
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyReturnDecimal = monthlyReturnRate / 100;
    
    // Phase 1: Calculate required corpus for desired monthly income
    // Using annuity formula: PV = PMT × [1 - (1 + r)^-n] / r
    const months = retirementYears * 12;
    const requiredCorpus = monthlyIncome * (1 - Math.pow(1 + monthlyReturnDecimal, -months)) / monthlyReturnDecimal;
    
    // Calculate required monthly SIP to build this corpus
    const sipMonthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const sipMonths = yearsToRetirement * 12;
    const requiredSIP = requiredCorpus * sipMonthlyRate / (Math.pow(1 + sipMonthlyRate, sipMonths) - 1) / (1 + sipMonthlyRate);
    
    // Calculate total investment required
    const totalInvestment = requiredSIP * sipMonths;
    
    // Phase 1: Accumulation Results
    const accumulationHTML = `
        <div class="result-item">
            <span class="label">Years to Build Corpus</span>
            <span class="value">${yearsToRetirement} years</span>
        </div>
        <div class="result-item highlight">
            <span class="label">Required Corpus at Retirement</span>
            <span class="value">${formatCurrency(requiredCorpus)}</span>
        </div>
        <div class="result-item highlight">
            <span class="label">Required Monthly SIP</span>
            <span class="value">${formatCurrency(requiredSIP)}</span>
        </div>
        <div class="result-item">
            <span class="label">Total Investment Needed</span>
            <span class="value">${formatCurrency(totalInvestment)}</span>
        </div>
        <div class="result-item">
            <span class="label">Wealth Multiplier</span>
            <span class="value">${(requiredCorpus / totalInvestment).toFixed(1)}x</span>
        </div>
    `;
    
    // Phase 2: Verify corpus sustainability
    let testCorpus = requiredCorpus;
    let monthsSustainable = 0;
    for (let month = 1; month <= months; month++) {
        testCorpus = testCorpus * (1 + monthlyReturnDecimal) - monthlyIncome;
        if (testCorpus >= 0) {
            monthsSustainable = month;
        } else {
            break;
        }
    }
    const yearsSustainable = monthsSustainable / 12;
    
    const isSustainable = monthsSustainable >= months;
    const sustainabilityStatus = isSustainable ? 'Fully Sustainable ✅' : 'Not Sustainable ⚠️';
    const statusClass = isSustainable ? 'success' : 'error';
    
    // Phase 2: Sustainability Results
    const sustainabilityHTML = `
        <div class="result-item ${statusClass}">
            <span class="label">Sustainability Status</span>
            <span class="value">${sustainabilityStatus}</span>
        </div>
        <div class="result-item">
            <span class="label">Actual Sustainable Period</span>
            <span class="value">${yearsSustainable.toFixed(1)} years</span>
        </div>
        <div class="result-item">
            <span class="label">Monthly Return Required</span>
            <span class="value">${monthlyReturnRate}% (${(monthlyReturnRate * 12).toFixed(1)}% annually)</span>
        </div>
        <div class="result-item">
            <span class="label">Desired Income</span>
            <span class="value">${formatCurrency(monthlyIncome)}/month</span>
        </div>
    `;
    
    // Recommendation
    let recommendationHTML = '';
    if (isSustainable) {
        recommendationHTML = `
            <div class="result-item success">
                <span class="label">✅ Recommendation</span>
                <span class="value">Your plan is viable! Start SIP of ${formatCurrency(requiredSIP)}/month</span>
            </div>
            <div class="result-item">
                <span class="label">Action Plan</span>
                <span class="value">Invest ${formatCurrency(requiredSIP)} monthly for ${yearsToRetirement} years at ${expectedReturn}% return</span>
            </div>
            <div class="result-item">
                <span class="label">Post-Retirement Strategy</span>
                <span class="value">Shift to conservative ${monthlyReturnRate}% monthly return investments</span>
            </div>
        `;
    } else {
        const adjustedSIP = requiredSIP * 1.2;
        const adjustedCorpus = requiredCorpus * 1.2;
        
        recommendationHTML = `
            <div class="result-item error">
                <span class="label">⚠️ Issue Identified</span>
                <span class="value">Current plan may not sustain desired income for full ${retirementYears} years</span>
            </div>
            <div class="result-item">
                <span class="label">Recommended SIP (20% higher)</span>
                <span class="value">${formatCurrency(adjustedSIP)}/month</span>
            </div>
            <div class="result-item">
                <span class="label">Recommended Corpus</span>
                <span class="value">${formatCurrency(adjustedCorpus)}</span>
            </div>
            <div class="result-item">
                <span class="label">Alternative Options</span>
                <span class="value">Retire at ${retirementAge + 2} or reduce monthly income to ${formatCurrency(monthlyIncome * 0.8)}</span>
            </div>
        `;
    }
    
    document.getElementById('accumulation-results').innerHTML = accumulationHTML;
    document.getElementById('sustainability-results').innerHTML = sustainabilityHTML;
    document.getElementById('retirement-recommendation').innerHTML = recommendationHTML;
}

// Investment Comparison Implementation
function initializeComparisons() {
    investmentComparisons = [
        { id: 'comp-1', name: 'Equity Mutual Fund', amount: 100000, return: 12 },
        { id: 'comp-2', name: 'Fixed Deposit', amount: 100000, return: 7 }
    ];
    renderComparisons();
}

function addComparison() {
    const id = 'comp-' + Date.now();
    investmentComparisons.push({
        id: id,
        name: 'Investment ' + (investmentComparisons.length + 1),
        amount: 100000,
        return: 10
    });
    renderComparisons();
    calculateComparison();
}

function removeComparison(id) {
    if (investmentComparisons.length > 1) {
        investmentComparisons = investmentComparisons.filter(comp => comp.id !== id);
        renderComparisons();
        calculateComparison();
    }
}

function renderComparisons() {
    const container = document.getElementById('comparison-list');
    container.innerHTML = '';
    
    investmentComparisons.forEach(comp => {
        const div = document.createElement('div');
        div.className = 'comparison-item';
        div.innerHTML = `
            <div class="input-group">
                <label>Investment Name</label>
                <input type="text" value="${comp.name}" 
                       onchange="updateComparison('${comp.id}', 'name', this.value)">
            </div>
            <div class="input-group">
                <label>Amount (₹)</label>
                <input type="number" value="${comp.amount}" 
                       onchange="updateComparison('${comp.id}', 'amount', this.value)">
            </div>
            <div class="input-group">
                <label>Expected Return (%)</label>
                <input type="number" value="${comp.return}" step="0.1" 
                       onchange="updateComparison('${comp.id}', 'return', this.value)">
            </div>
            ${investmentComparisons.length > 1 ? 
                `<button class="remove-btn" onclick="removeComparison('${comp.id}')">Remove</button>` : 
                '<div></div>'}
        `;
        container.appendChild(div);
    });
}

function updateComparison(id, field, value) {
    const comp = investmentComparisons.find(c => c.id === id);
    if (comp) {
        if (field === 'name') {
            comp[field] = value;
        } else {
            comp[field] = validateInput(value, field === 'amount' ? 1000 : 0.1);
        }
        calculateComparison();
    }
}

function calculateComparison() {
    const years = validateInput(document.getElementById('comparison-years').value, 1, 50);
    
    const results = investmentComparisons.map(comp => {
        const maturity = comp.amount * Math.pow(1 + comp.return / 100, years);
        const growth = maturity - comp.amount;
        const multiplier = maturity / comp.amount;
        
        return {
            ...comp,
            maturity,
            growth,
            multiplier
        };
    }).sort((a, b) => b.maturity - a.maturity);
    
    let resultsHTML = `
        <div class="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Investment</th>
                        <th>Amount</th>
                        <th>Return %</th>
                        <th>Maturity Value</th>
                        <th>Growth</th>
                        <th>Multiplier</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    results.forEach((result, index) => {
        const rank = index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1);
        resultsHTML += `
            <tr>
                <td>${rank}</td>
                <td>${result.name}</td>
                <td>${formatCurrency(result.amount)}</td>
                <td>${result.return}%</td>
                <td><strong>${formatCurrency(result.maturity)}</strong></td>
                <td>${formatCurrency(result.growth)}</td>
                <td>${result.multiplier.toFixed(1)}x</td>
            </tr>
        `;
    });
    
    resultsHTML += '</tbody></table></div>';
    document.getElementById('comparison-results').innerHTML = resultsHTML;
}

// Bill Splitter Implementation
function initializeBillSplitter() {
    groupMembers = ['Member 1', 'Member 2'];
    groupExpenses = [];
    renderMembers();
    renderExpenses();
}

function addMember() {
    const memberName = `Member ${groupMembers.length + 1}`;
    groupMembers.push(memberName);
    renderMembers();
    calculateBillSplit();
}

function removeMember(index) {
    if (groupMembers.length > 2) {
        const removedMember = groupMembers[index];
        groupMembers.splice(index, 1);
        
        // Update expenses to reassign removed member's expenses to first member
        groupExpenses.forEach(expense => {
            if (expense.paidBy === removedMember) {
                expense.paidBy = groupMembers[0];
            }
        });
        
        renderMembers();
        renderExpenses();
        calculateBillSplit();
    }
}

function renderMembers() {
    const container = document.getElementById('members-list');
    container.innerHTML = '';
    
    groupMembers.forEach((member, index) => {
        const div = document.createElement('div');
        div.className = 'member-item';
        div.innerHTML = `
            <div class="input-group">
                <input type="text" value="${member}" 
                       onchange="updateMember(${index}, this.value)"
                       placeholder="Member name">
                ${groupMembers.length > 2 ? 
                    `<button class="remove-btn" onclick="removeMember(${index})">Remove</button>` : 
                    ''}
            </div>
        `;
        container.appendChild(div);
    });
}

function updateMember(index, value) {
    const oldName = groupMembers[index];
    const newName = value.trim() || `Member ${index + 1}`;
    groupMembers[index] = newName;
    
    // Update expenses with old member name
    groupExpenses.forEach(expense => {
        if (expense.paidBy === oldName) {
            expense.paidBy = newName;
        }
    });
    
    renderExpenses();
    calculateBillSplit();
}

function addExpense() {
    const expenseId = 'expense-' + Date.now();
    groupExpenses.push({
        id: expenseId,
        description: 'Expense ' + (groupExpenses.length + 1),
        amount: 0,
        paidBy: groupMembers[0] || 'Member 1'
    });
    renderExpenses();
}

function removeExpense(id) {
    groupExpenses = groupExpenses.filter(exp => exp.id !== id);
    renderExpenses();
    calculateBillSplit();
}

function renderExpenses() {
    const container = document.getElementById('expenses-list');
    container.innerHTML = '';
    
    groupExpenses.forEach(expense => {
        const div = document.createElement('div');
        div.className = 'expense-item';
        
        const memberOptions = groupMembers.map(member => 
            `<option value="${member}" ${member === expense.paidBy ? 'selected' : ''}>${member}</option>`
        ).join('');
        
        div.innerHTML = `
            <div class="input-group">
                <label>Description</label>
                <input type="text" value="${expense.description}" 
                       onchange="updateExpense('${expense.id}', 'description', this.value)"
                       placeholder="Expense description">
            </div>
            <div class="input-group">
                <label>Amount (₹)</label>
                <input type="number" value="${expense.amount}" 
                       onchange="updateExpense('${expense.id}', 'amount', this.value)"
                       placeholder="0" min="0">
            </div>
            <div class="input-group">
                <label>Paid By</label>
                <select onchange="updateExpense('${expense.id}', 'paidBy', this.value)">
                    ${memberOptions}
                </select>
            </div>
            <button class="remove-btn" onclick="removeExpense('${expense.id}')">Remove</button>
        `;
        container.appendChild(div);
    });
}

function updateExpense(id, field, value) {
    const expense = groupExpenses.find(exp => exp.id === id);
    if (expense) {
        if (field === 'amount') {
            expense[field] = validateInput(value, 0);
        } else {
            expense[field] = value;
        }
        calculateBillSplit();
    }
}

function calculateBillSplit() {
    if (groupExpenses.length === 0) {
        document.getElementById('bill-results').innerHTML = '<p>Add expenses to see settlement details</p>';
        return;
    }
    
    const totalExpenses = groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonShare = totalExpenses / groupMembers.length;
    
    // Calculate what each person paid
    const memberPayments = {};
    groupMembers.forEach(member => {
        memberPayments[member] = groupExpenses
            .filter(exp => exp.paidBy === member)
            .reduce((sum, exp) => sum + exp.amount, 0);
    });
    
    // Calculate net balances
    const netBalances = {};
    groupMembers.forEach(member => {
        netBalances[member] = memberPayments[member] - perPersonShare;
    });
    
    // Generate settlements using optimized algorithm
    const settlements = calculateOptimalSettlements(netBalances);
    
    // Display results
    let resultsHTML = `
        <div class="summary-stats">
            <div class="result-item">
                <span class="label">Total Expenses</span>
                <span class="value">${formatCurrency(totalExpenses)}</span>
            </div>
            <div class="result-item">
                <span class="label">Per Person Share</span>
                <span class="value">${formatCurrency(perPersonShare)}</span>
            </div>
        </div>
        
        <div class="member-balances">
            <h4>Member Balances</h4>
    `;
    
    groupMembers.forEach(member => {
        const paid = memberPayments[member];
        const balance = netBalances[member];
        const status = balance > 0.01 ? 'Gets back' : balance < -0.01 ? 'Owes' : 'Settled';
        const statusClass = balance > 0.01 ? 'success' : balance < -0.01 ? 'error' : '';
        
        resultsHTML += `
            <div class="result-item ${statusClass}">
                <span class="label">${member} (Paid: ${formatCurrency(paid)})</span>
                <span class="value">${status}: ${formatCurrency(Math.abs(balance))}</span>
            </div>
        `;
    });
    
    resultsHTML += '</div>';
    
    if (settlements.length > 0) {
        resultsHTML += '<div class="settlements"><h4>Settlements Required</h4>';
        settlements.forEach(settlement => {
            resultsHTML += `
                <div class="result-item highlight">
                    <span class="label">${settlement.from} pays ${settlement.to}</span>
                    <span class="value">${formatCurrency(settlement.amount)}</span>
                </div>
            `;
        });
        resultsHTML += '</div>';
    } else {
        resultsHTML += '<div class="settlements"><h4>🎉 No settlements required - everyone is settled!</h4></div>';
    }
    
    document.getElementById('bill-results').innerHTML = resultsHTML;
}

function calculateOptimalSettlements(netBalances) {
    const settlements = [];
    const creditors = Object.entries(netBalances)
        .filter(([, balance]) => balance > 0.01)
        .sort((a, b) => b[1] - a[1]);
    const debtors = Object.entries(netBalances)
        .filter(([, balance]) => balance < -0.01)
        .sort((a, b) => a[1] - b[1]);
    
    let creditorIndex = 0;
    let debtorIndex = 0;
    
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
        const [creditor, creditAmount] = creditors[creditorIndex];
        const [debtor, debtAmount] = debtors[debtorIndex];
        
        const settlementAmount = Math.min(creditAmount, Math.abs(debtAmount));
        
        if (settlementAmount > 0.01) {
            settlements.push({
                from: debtor,
                to: creditor,
                amount: settlementAmount
            });
        }
        
        creditors[creditorIndex][1] -= settlementAmount;
        debtors[debtorIndex][1] += settlementAmount;
        
        if (Math.abs(creditors[creditorIndex][1]) < 0.01) creditorIndex++;
        if (Math.abs(debtors[debtorIndex][1]) < 0.01) debtorIndex++;
    }
    
    return settlements;
}

// Transaction Analysis Functions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processTransactionFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    const uploadArea = event.currentTarget;
    uploadArea.classList.add('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    const uploadArea = event.currentTarget;
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processTransactionFile(files[0]);
    }
}

function processTransactionFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        parseAndAnalyzeTransactions(csv);
    };
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
}

function parseAndAnalyzeTransactions(csv) {
    const lines = csv.trim().split('\n');
    const transactions = [];
    
    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = parseCSVLine(line);
        if (columns.length >= 3) {
            const transaction = {
                date: columns[0],
                description: columns[1],
                amount: Math.abs(parseFloat(columns[2]) || 0)
            };
            
            if (transaction.amount > 0) {
                transaction.category = categorizeTransaction(transaction.description);
                transactions.push(transaction);
            }
        }
    }
    
    if (transactions.length > 0) {
        transactionData = transactions;
        displayAnalysisResults();
    } else {
        alert('No valid transactions found. Please check file format:\nDate,Description,Amount');
    }
}

function parseCSVLine(line) {
    const columns = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            columns.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    columns.push(current.trim());
    return columns;
}

function categorizeTransaction(description) {
    const desc = description.toLowerCase();
    
    // Food & Dining
    if (desc.includes('swiggy') || desc.includes('zomato') || desc.includes('restaurant') || 
        desc.includes('food') || desc.includes('pizza') || desc.includes('burger') || 
        desc.includes('cafe') || desc.includes('hotel') || desc.includes('dining') ||
        desc.includes('mcdonald') || desc.includes('kfc') || desc.includes('dominos')) {
        return 'Food & Dining';
    }
    
    // Bills & Utilities
    if (desc.includes('recharge') || desc.includes('bill') || desc.includes('electricity') || 
        desc.includes('water') || desc.includes('gas') || desc.includes('internet') || 
        desc.includes('broadband') || desc.includes('mobile') || desc.includes('phone') || 
        desc.includes('utility') || desc.includes('bsnl') || desc.includes('airtel') ||
        desc.includes('jio') || desc.includes('vi ')) {
        return 'Bills & Utilities';
    }
    
    // Petrol & Transportation
    if (desc.includes('petrol') || desc.includes('fuel') || desc.includes('gas station') || 
        desc.includes('shell') || desc.includes('hp') || desc.includes('ioc') || 
        desc.includes('uber') || desc.includes('ola') || desc.includes('taxi') || 
        desc.includes('auto') || desc.includes('transport') || desc.includes('metro') ||
        desc.includes('bus') || desc.includes('train')) {
        return 'Petrol & Transportation';
    }
    
    // Shopping & Entertainment
    if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('shopping') || 
        desc.includes('mall') || desc.includes('store') || desc.includes('retail') || 
        desc.includes('movie') || desc.includes('cinema') || desc.includes('theater') || 
        desc.includes('game') || desc.includes('entertainment') || desc.includes('netflix') ||
        desc.includes('spotify') || desc.includes('prime')) {
        return 'Shopping & Entertainment';
    }
    
    // Healthcare
    if (desc.includes('hospital') || desc.includes('clinic') || desc.includes('doctor') || 
        desc.includes('pharmacy') || desc.includes('medical') || desc.includes('health') || 
        desc.includes('medicine') || desc.includes('apollo') || desc.includes('medplus')) {
        return 'Healthcare';
    }
    
    // Default to Miscellaneous
    return 'Miscellaneous';
}

function displayAnalysisResults() {
    document.getElementById('analysis-results').style.display = 'block';
    
    // Calculate statistics
    const totalTransactions = transactionData.length;
    const totalSpending = transactionData.reduce((sum, t) => sum + t.amount, 0);
    const avgTransaction = totalSpending / totalTransactions;
    
    // Category breakdown
    const categories = {};
    transactionData.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    
    const categoriesCount = Object.keys(categories).length;
    
    // Update statistics
    document.getElementById('total-transactions').textContent = formatNumber(totalTransactions);
    document.getElementById('total-spending').textContent = formatCurrency(totalSpending);
    document.getElementById('avg-transaction').textContent = formatCurrency(avgTransaction);
    document.getElementById('categories-count').textContent = categoriesCount;
    
    // Create charts
    createCategoryChart(categories);
    createTrendChart();
    
    // Display category details
    displayCategoryDetails(categories);
    
    // Generate insights
    generateSpendingInsights(categories, totalSpending);
}

function createCategoryChart(categories) {
    const ctx = document.getElementById('category-chart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    const colors = [
        '#FFD700', // Gold
        '#FFA500', // Orange  
        '#32CD32', // Green
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#95E1D3'  // Mint
    ];
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#333',
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function createTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    
    if (trendChart) {
        trendChart.destroy();
    }
    
    // Group transactions by month
    const monthlyData = {};
    
    transactionData.forEach(t => {
        const date = new Date(t.date);
        if (isNaN(date.getTime())) return; // Skip invalid dates
        
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + t.amount;
    });
    
    const months = Object.keys(monthlyData).sort();
    const amounts = months.map(month => monthlyData[month]);
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Spending',
                data: amounts,
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#FFD700',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#333'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            }
        }
    });
}

function displayCategoryDetails(categories) {
    const container = document.getElementById('category-details');
    const totalSpending = Object.values(categories).reduce((sum, val) => sum + val, 0);
    
    let html = '';
    
    Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, amount]) => {
            const percentage = ((amount / totalSpending) * 100).toFixed(1);
            const transactionCount = transactionData.filter(t => t.category === category).length;
            const avgAmount = amount / transactionCount;
            
            html += `
                <div class="category-detail">
                    <div class="category-header">
                        <h4>${category}</h4>
                        <span class="category-total">${formatCurrency(amount)} (${percentage}%)</span>
                    </div>
                    <div class="category-stats">
                        <span>Transactions: ${transactionCount}</span>
                        <span>Average: ${formatCurrency(avgAmount)}</span>
                    </div>
                </div>
            `;
        });
    
    container.innerHTML = html;
}

function generateSpendingInsights(categories, totalSpending) {
    const insights = [];
    
    // Find highest spending category
    const highestCategory = Object.entries(categories).reduce((max, [cat, amount]) => 
        amount > max.amount ? { category: cat, amount } : max, 
        { category: '', amount: 0 }
    );
    
    if (highestCategory.amount > 0) {
        const percentage = ((highestCategory.amount / totalSpending) * 100).toFixed(1);
        insights.push(`💡 Your highest spending category is <strong>${highestCategory.category}</strong> at ${formatCurrency(highestCategory.amount)} (${percentage}% of total spending).`);
    }
    
    // Find average transaction amount
    const avgTransaction = totalSpending / transactionData.length;
    insights.push(`📊 Your average transaction amount is ${formatCurrency(avgTransaction)}.`);
    
    // Monthly average
    const monthsSpanned = new Set(transactionData.map(t => {
        const date = new Date(t.date);
        return isNaN(date.getTime()) ? null : `${date.getFullYear()}-${date.getMonth()}`;
    }).filter(Boolean)).size;
    
    const monthlyAverage = totalSpending / Math.max(monthsSpanned, 1);
    insights.push(`📅 Your average monthly spending is ${formatCurrency(monthlyAverage)} across ${monthsSpanned} months.`);
    
    // Largest single transaction
    const largestTransaction = Math.max(...transactionData.map(t => t.amount));
    const largestTx = transactionData.find(t => t.amount === largestTransaction);
    insights.push(`💰 Your largest single transaction was ${formatCurrency(largestTransaction)} for "${largestTx.description}".`);
    
    // Spending pattern insight
    const foodSpending = categories['Food & Dining'] || 0;
    const foodPercentage = (foodSpending / totalSpending) * 100;
    if (foodPercentage > 25) {
        insights.push(`🍽️ You spend ${foodPercentage.toFixed(1)}% on food & dining. Consider cooking more at home to save money.`);
    }
    
    // Display insights
    const container = document.getElementById('spending-insights');
    container.innerHTML = insights.map(insight => `<div class="insight-item">${insight}</div>`).join('');
}

// Add event listeners for drag and drop
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragleave', function(e) {
            if (!uploadArea.contains(e.relatedTarget)) {
                uploadArea.classList.remove('dragover');
            }
        });
    }
});

// Performance optimization - debounced calculation functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to calculation functions for better performance
const debouncedEMICalculation = debounce(calculateEMI, 300);
const debouncedSIPCalculation = debounce(calculateSIP, 300);
const debouncedPrepaymentCalculation = debounce(calculatePrepayments, 300);

// Error handling wrapper
function safeCalculation(calculationFunction, errorElementId) {
    return function(...args) {
        try {
            calculationFunction(...args);
        } catch (error) {
            console.error('Calculation error:', error);
            const errorElement = document.getElementById(errorElementId);
            if (errorElement) {
                errorElement.innerHTML = '<p style="color: red;">Calculation error. Please check your inputs.</p>';
            }
        }
    };
}

// Console log for debugging
console.log('HG Financial Calculator script loaded successfully!');
console.log('Developed by Hemachand Gogula - hemachandgogula@gmail.com');