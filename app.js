// Global variables
let comparators = [];
let expenses = [];
let groupMembers = [];
let prepayments = [];
let loanDetails = {};
let transactions = [];

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Main tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
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
            
            // Remove active class from all wealth tabs
            wealthTabBtns.forEach(b => b.classList.remove('active'));
            wealthTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // SIP calculator sub-tabs
    const sipTabBtns = document.querySelectorAll('.sip-tab-btn');
    const sipTabContents = document.querySelectorAll('.sip-tab-content');
    
    sipTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-sip-tab');
            
            // Remove active class from all SIP tabs
            sipTabBtns.forEach(b => b.classList.remove('active'));
            sipTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

// EMI Calculator
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value);
    const loanTenure = parseFloat(document.getElementById('loan-tenure').value);
    
    if (!loanAmount || !interestRate || !loanTenure) {
        alert('Please fill in all fields');
        return;
    }
    
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTenure * 12;
    
    // EMI Formula: P[r(1+r)^n]/[(1+r)^n-1]
    const emi = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalAmount = emi * numberOfPayments;
    const totalInterest = totalAmount - loanAmount;
    const interestPercentage = (totalInterest / loanAmount) * 100;
    
    // Display results
    document.getElementById('monthly-emi').textContent = formatCurrency(emi);
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('interest-percentage').textContent = interestPercentage.toFixed(2) + '%';
    
    document.getElementById('emi-results').classList.remove('hidden');
}

// ENHANCED Prepayment Calculator with EMI Savings Card
function setupLoanDetails() {
    const loanAmount = parseFloat(document.getElementById('prep-loan-amount').value);
    const interestRate = parseFloat(document.getElementById('prep-interest-rate').value);
    const loanTenure = parseFloat(document.getElementById('prep-tenure').value);
    
    if (!loanAmount || !interestRate || !loanTenure) {
        alert('Please fill in all loan details');
        return;
    }
    
    loanDetails = {
        amount: loanAmount,
        rate: interestRate,
        tenure: loanTenure
    };
    
    prepayments = [];
    document.getElementById('prepayment-section').classList.remove('hidden');
    updatePrepaymentsList();
}

function addPrepayment() {
    const amount = parseFloat(document.getElementById('prepayment-amount-input').value);
    const month = parseInt(document.getElementById('prepayment-month-input').value);
    const option = document.getElementById('prepayment-option').value;
    
    if (!amount || !month) {
        alert('Please fill in prepayment details');
        return;
    }
    
    if (month <= 0 || month > (loanDetails.tenure * 12)) {
        alert('Invalid month. Please enter a month between 1 and ' + (loanDetails.tenure * 12));
        return;
    }
    
    // Check if prepayment already exists for this month
    if (prepayments.some(p => p.month === month)) {
        alert('Prepayment already exists for month ' + month);
        return;
    }
    
    const prepayment = {
        id: Date.now(),
        amount,
        month,
        option
    };
    
    prepayments.push(prepayment);
    prepayments.sort((a, b) => a.month - b.month);
    
    // Clear form
    document.getElementById('prepayment-amount-input').value = '';
    document.getElementById('prepayment-month-input').value = '';
    
    updatePrepaymentsList();
}

function removePrepayment(id) {
    prepayments = prepayments.filter(p => p.id !== id);
    updatePrepaymentsList();
}

function updatePrepaymentsList() {
    const list = document.getElementById('prepayments-list');
    
    if (prepayments.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-gold);">No prepayments added yet</p>';
        document.getElementById('calculate-prep-btn').style.display = 'none';
        return;
    }
    
    let html = '<h4>Scheduled Prepayments:</h4>';
    prepayments.forEach(prepayment => {
        const optionText = prepayment.option === 'reduce-emi' ? 'Reduce EMI' : 'Reduce Tenure';
        html += `
            <div class="prepayment-item">
                <div class="prepayment-details">
                    <p><strong>Month ${prepayment.month}:</strong> ${formatCurrency(prepayment.amount)}</p>
                    <p><strong>Option:</strong> ${optionText}</p>
                </div>
                <button class="remove-prepayment" onclick="removePrepayment(${prepayment.id})">Remove</button>
            </div>
        `;
    });
    
    list.innerHTML = html;
    document.getElementById('calculate-prep-btn').style.display = 'block';
}

function calculateMultiplePrepayments() {
    if (prepayments.length === 0) {
        alert('Please add at least one prepayment');
        return;
    }
    
    const monthlyRate = loanDetails.rate / 12 / 100;
    const numberOfPayments = loanDetails.tenure * 12;
    
    // Calculate original EMI and totals
    const originalEmi = loanDetails.amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const originalTotalAmount = originalEmi * numberOfPayments;
    const originalTotalInterest = originalTotalAmount - loanDetails.amount;
    
    // Simulate loan with prepayments
    let remainingBalance = loanDetails.amount;
    let totalInterestPaid = 0;
    let totalPrepaymentAmount = 0;
    let month = 0;
    let schedule = [];
    let currentEmi = originalEmi;
    let emiReduction = 0;
    
    while (remainingBalance > 0.01 && month < numberOfPayments) {
        month++;
        
        // Calculate interest for this month
        const monthlyInterest = remainingBalance * monthlyRate;
        const monthlyPrincipal = Math.min(currentEmi - monthlyInterest, remainingBalance);
        
        totalInterestPaid += monthlyInterest;
        remainingBalance -= monthlyPrincipal;
        
        // Check for prepayment this month
        const prepayment = prepayments.find(p => p.month === month);
        if (prepayment && remainingBalance > 0) {
            const actualPrepayment = Math.min(prepayment.amount, remainingBalance);
            remainingBalance -= actualPrepayment;
            totalPrepaymentAmount += actualPrepayment;
            
            // Handle EMI option
            if (prepayment.option === 'reduce-emi' && remainingBalance > 0) {
                const remainingMonths = numberOfPayments - month;
                const newEmi = remainingBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                              (Math.pow(1 + monthlyRate, remainingMonths) - 1);
                emiReduction += (currentEmi - newEmi);
                currentEmi = newEmi;
            }
            
            // Add to schedule
            schedule.push({
                month,
                prepayment: actualPrepayment,
                remainingBalance,
                option: prepayment.option,
                newEmi: prepayment.option === 'reduce-emi' ? currentEmi : originalEmi
            });
        }
    }
    
    const newTotalAmount = loanDetails.amount + totalPrepaymentAmount + totalInterestPaid;
    const interestSavings = originalTotalInterest - totalInterestPaid;
    const timeSaved = numberOfPayments - month;
    
    // Display results
    document.getElementById('prep-original-emi').textContent = formatCurrency(originalEmi);
    document.getElementById('prep-original-interest').textContent = formatCurrency(originalTotalInterest);
    document.getElementById('prep-original-total').textContent = formatCurrency(originalTotalAmount);
    
    document.getElementById('total-prepayments').textContent = formatCurrency(totalPrepaymentAmount);
    document.getElementById('prep-new-interest').textContent = formatCurrency(totalInterestPaid);
    document.getElementById('prep-new-total').textContent = formatCurrency(newTotalAmount);
    
    // NEW: Display dual savings cards
    document.getElementById('time-savings').textContent = timeSaved + ' months';
    document.getElementById('new-tenure').textContent = month + ' months';
    document.getElementById('interest-savings').textContent = formatCurrency(interestSavings);
    
    // Handle EMI reduction display
    const emiReductionInfo = document.getElementById('emi-reduction-info');
    if (emiReduction > 0) {
        document.getElementById('emi-reduction').textContent = formatCurrency(emiReduction);
        emiReductionInfo.style.display = 'flex';
        document.getElementById('emi-reduction-info').querySelector('.label').textContent = 'Total EMI Reduction:';
    } else {
        document.getElementById('emi-reduction').textContent = 'N/A (Reduce Tenure)';
        emiReductionInfo.style.display = 'flex';
        document.getElementById('emi-reduction-info').querySelector('.label').textContent = 'EMI Reduction:';
    }
    
    // Create schedule table
    let scheduleHtml = '<h4>Prepayment Schedule</h4>';
    if (schedule.length > 0) {
        scheduleHtml += `
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Prepayment</th>
                        <th>Option</th>
                        <th>New EMI</th>
                        <th>Remaining Balance</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        schedule.forEach(item => {
            const optionText = item.option === 'reduce-emi' ? 'Reduce EMI' : 'Reduce Tenure';
            scheduleHtml += `
                <tr>
                    <td>${item.month}</td>
                    <td>${formatCurrency(item.prepayment)}</td>
                    <td>${optionText}</td>
                    <td>${formatCurrency(item.newEmi)}</td>
                    <td>${formatCurrency(item.remainingBalance)}</td>
                </tr>
            `;
        });
        
        scheduleHtml += '</tbody></table>';
    }
    
    document.getElementById('prepayment-schedule').innerHTML = scheduleHtml;
    document.getElementById('prepayment-results').classList.remove('hidden');
}

// Enhanced SIP Calculator - Groww Methodology with Lumpsum Options
function calculateSIP() {
    const monthlyAmount = parseFloat(document.getElementById('sip-amount').value);
    const annualReturn = parseFloat(document.getElementById('sip-return').value);
    const years = parseFloat(document.getElementById('sip-tenure').value);
    
    if (!monthlyAmount || !annualReturn || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    const months = years * 12;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
    
    // Groww SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const maturityAmount = monthlyAmount * 
        (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
    
    const totalInvestment = monthlyAmount * months;
    const capitalGains = maturityAmount - totalInvestment;
    
    // Display results
    document.getElementById('sip-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('sip-maturity-amount').textContent = formatCurrency(maturityAmount);
    document.getElementById('sip-capital-gains').textContent = formatCurrency(capitalGains);
    
    document.getElementById('sip-results').classList.remove('hidden');
}

function calculateLumpsum() {
    const lumpsumAmount = parseFloat(document.getElementById('lumpsum-amount').value);
    const annualReturn = parseFloat(document.getElementById('lumpsum-return').value);
    const years = parseFloat(document.getElementById('lumpsum-tenure').value);
    
    if (!lumpsumAmount || !annualReturn || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = lumpsumAmount * Math.pow(1 + annualReturn / 100, years);
    const capitalGains = maturityAmount - lumpsumAmount;
    
    // Display results
    document.getElementById('lumpsum-initial-investment').textContent = formatCurrency(lumpsumAmount);
    document.getElementById('lumpsum-maturity-amount').textContent = formatCurrency(maturityAmount);
    document.getElementById('lumpsum-capital-gains').textContent = formatCurrency(capitalGains);
    
    document.getElementById('lumpsum-results').classList.remove('hidden');
}

function calculateCombined() {
    const sipAmount = parseFloat(document.getElementById('combined-sip-amount').value);
    const lumpsumAmount = parseFloat(document.getElementById('combined-lumpsum-amount').value);
    const annualReturn = parseFloat(document.getElementById('combined-return').value);
    const years = parseFloat(document.getElementById('combined-tenure').value);
    
    if (!sipAmount || !lumpsumAmount || !annualReturn || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    const months = years * 12;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
    
    // Calculate SIP component
    const sipMaturity = sipAmount * 
        (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
    const sipInvestment = sipAmount * months;
    
    // Calculate Lumpsum component
    const lumpsumMaturity = lumpsumAmount * Math.pow(1 + annualReturn / 100, years);
    
    // Combined totals
    const totalInvestment = sipInvestment + lumpsumAmount;
    const totalMaturity = sipMaturity + lumpsumMaturity;
    const totalGains = totalMaturity - totalInvestment;
    
    // Display results
    document.getElementById('combined-sip-investment').textContent = formatCurrency(sipInvestment);
    document.getElementById('combined-sip-maturity').textContent = formatCurrency(sipMaturity);
    document.getElementById('combined-lumpsum-investment').textContent = formatCurrency(lumpsumAmount);
    document.getElementById('combined-lumpsum-maturity').textContent = formatCurrency(lumpsumMaturity);
    document.getElementById('combined-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('combined-total-maturity').textContent = formatCurrency(totalMaturity);
    document.getElementById('combined-total-gains').textContent = formatCurrency(totalGains);
    
    document.getElementById('combined-results').classList.remove('hidden');
}

// SWP Calculator
function calculateSWP() {
    const initialInvestment = parseFloat(document.getElementById('swp-initial-investment').value);
    const monthlyWithdrawal = parseFloat(document.getElementById('swp-withdrawal').value);
    const annualReturn = parseFloat(document.getElementById('swp-return').value);
    const years = parseFloat(document.getElementById('swp-duration').value);
    
    if (!initialInvestment || !monthlyWithdrawal || !annualReturn || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    const months = years * 12;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
    
    let currentBalance = initialInvestment;
    let totalWithdrawn = 0;
    let isSustainable = true;
    
    // Simulate month by month
    for (let month = 1; month <= months; month++) {
        // Apply monthly return
        currentBalance = currentBalance * (1 + monthlyReturn);
        
        // Check if withdrawal is possible
        if (currentBalance >= monthlyWithdrawal) {
            currentBalance -= monthlyWithdrawal;
            totalWithdrawn += monthlyWithdrawal;
        } else {
            isSustainable = false;
            totalWithdrawn += currentBalance;
            currentBalance = 0;
            break;
        }
    }
    
    const totalValue = totalWithdrawn + Math.max(0, currentBalance);
    
    // Display results
    document.getElementById('swp-total-withdrawal').textContent = formatCurrency(totalWithdrawn);
    document.getElementById('swp-remaining-balance').textContent = formatCurrency(Math.max(0, currentBalance));
    document.getElementById('swp-total-value').textContent = formatCurrency(totalValue);
    
    const sustainabilityNote = document.getElementById('swp-sustainability');
    if (isSustainable) {
        sustainabilityNote.textContent = '✅ Your SWP plan is sustainable for the entire duration';
        sustainabilityNote.className = 'sustainability-note sustainable';
    } else {
        sustainabilityNote.textContent = '⚠️ Your SWP plan is not sustainable for the entire duration. Consider reducing withdrawal amount or increasing expected returns.';
        sustainabilityNote.className = 'sustainability-note unsustainable';
    }
    
    document.getElementById('swp-results').classList.remove('hidden');
}

// Goal Planning Calculator
function calculateGoalPlanning() {
    const goalAmount = parseFloat(document.getElementById('goal-amount').value);
    const timeline = parseFloat(document.getElementById('goal-timeline').value);
    const annualReturn = parseFloat(document.getElementById('goal-return').value);
    
    if (!goalAmount || !timeline || !annualReturn) {
        alert('Please fill in all fields');
        return;
    }
    
    const months = timeline * 12;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
    
    // Calculate required monthly SIP using reverse SIP formula
    const requiredSIP = goalAmount / 
        (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
    
    const totalInvestment = requiredSIP * months;
    const capitalGains = goalAmount - totalInvestment;
    
    // Display results
    document.getElementById('required-sip').textContent = formatCurrency(requiredSIP);
    document.getElementById('goal-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('goal-capital-gains').textContent = formatCurrency(capitalGains);
    
    document.getElementById('goal-results').classList.remove('hidden');
}

// REDESIGNED Advanced Retirement Planning Calculator
function calculateAdvancedRetirement() {
    const currentAge = parseFloat(document.getElementById('current-age').value);
    const retirementAge = parseFloat(document.getElementById('retirement-age').value);
    const targetCorpus = parseFloat(document.getElementById('target-corpus').value);
    const accumulationReturn = parseFloat(document.getElementById('accumulation-return').value);
    const desiredMonthlyIncome = parseFloat(document.getElementById('desired-monthly-income').value);
    const withdrawalReturn = parseFloat(document.getElementById('withdrawal-return').value);
    const withdrawalDuration = parseFloat(document.getElementById('withdrawal-duration').value);
    
    if (!currentAge || !retirementAge || !targetCorpus || !accumulationReturn || 
        !desiredMonthlyIncome || !withdrawalReturn || !withdrawalDuration) {
        alert('Please fill in all fields');
        return;
    }
    
    if (retirementAge <= currentAge) {
        alert('Retirement age must be greater than current age');
        return;
    }
    
    const yearsToRetirement = retirementAge - currentAge;
    
    // PHASE 1: Accumulation Calculation
    const months = yearsToRetirement * 12;
    const monthlyReturn = Math.pow(1 + accumulationReturn / 100, 1/12) - 1;
    
    // Calculate required monthly SIP for target corpus
    const requiredMonthlySIP = targetCorpus / 
        (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
    
    const totalInvestment = requiredMonthlySIP * months;
    
    // PHASE 2: Withdrawal Phase Analysis
    const withdrawalMonths = withdrawalDuration * 12;
    const monthlyWithdrawalReturn = Math.pow(1 + withdrawalReturn / 100, 1/12) - 1;
    
    // Calculate sustainable monthly income from corpus
    let corpus = targetCorpus;
    let totalWithdrawn = 0;
    let monthsCompleted = 0;
    let canSustain = true;
    
    // Simulate withdrawal for the entire duration
    for (let month = 1; month <= withdrawalMonths; month++) {
        // Apply monthly return
        corpus = corpus * (1 + monthlyWithdrawalReturn);
        
        // Check if desired withdrawal is possible
        if (corpus >= desiredMonthlyIncome) {
            corpus -= desiredMonthlyIncome;
            totalWithdrawn += desiredMonthlyIncome;
            monthsCompleted++;
        } else {
            canSustain = false;
            break;
        }
    }
    
    // Calculate what the corpus can actually provide
    let sustainableIncome = 0;
    if (canSustain) {
        sustainableIncome = desiredMonthlyIncome;
    } else {
        // Calculate maximum sustainable income
        let testCorpus = targetCorpus;
        sustainableIncome = (testCorpus * monthlyWithdrawalReturn) / 
                           (1 - Math.pow(1 + monthlyWithdrawalReturn, -withdrawalMonths));
    }
    
    // Display Phase 1 Results
    document.getElementById('years-to-retirement').textContent = yearsToRetirement + ' years';
    document.getElementById('retirement-monthly-sip').textContent = formatCurrency(requiredMonthlySIP);
    document.getElementById('retirement-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('final-corpus').textContent = formatCurrency(targetCorpus);
    
    // Display Phase 2 Results
    document.getElementById('target-monthly-income').textContent = formatCurrency(desiredMonthlyIncome);
    document.getElementById('sustainable-monthly-income').textContent = formatCurrency(sustainableIncome);
    document.getElementById('income-duration').textContent = withdrawalDuration + ' years';
    document.getElementById('remaining-corpus').textContent = formatCurrency(corpus);
    
    // Sufficiency Analysis
    const sufficiencyResult = document.getElementById('sufficiency-result');
    const sufficiencyTitle = document.getElementById('sufficiency-title');
    const sufficiencyMessage = document.getElementById('sufficiency-message');
    const recommendations = document.getElementById('sufficiency-recommendations');
    
    if (canSustain && sustainableIncome >= desiredMonthlyIncome) {
        // Sufficient
        sufficiencyTitle.textContent = '✅ Plan is Sufficient!';
        sufficiencyMessage.textContent = `Great news! Your target corpus of ${formatCurrency(targetCorpus)} can comfortably provide ${formatCurrency(desiredMonthlyIncome)} monthly for ${withdrawalDuration} years.`;
        sufficiencyMessage.className = 'sufficiency-message sufficient';
        
        recommendations.innerHTML = `
            <h5>💡 Recommendations:</h5>
            <ul>
                <li>Start your SIP of ${formatCurrency(requiredMonthlySIP)} today</li>
                <li>Review and increase SIP annually with income growth</li>
                <li>Consider additional investments if income allows</li>
                <li>Monitor market performance and adjust strategy if needed</li>
            </ul>
        `;
    } else {
        // Insufficient
        const shortage = desiredMonthlyIncome - sustainableIncome;
        const additionalCorpusNeeded = (desiredMonthlyIncome * withdrawalMonths) / 
                                      (1 - Math.pow(1 + monthlyWithdrawalReturn, -withdrawalMonths));
        const additionalSIPNeeded = (additionalCorpusNeeded - targetCorpus) / 
                                   (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
        
        sufficiencyTitle.textContent = '⚠️ Plan Needs Improvement';
        sufficiencyMessage.textContent = `Your corpus can only provide ${formatCurrency(sustainableIncome)} monthly. You'll be short by ${formatCurrency(shortage)} per month.`;
        sufficiencyMessage.className = 'sufficiency-message insufficient';
        
        recommendations.innerHTML = `
            <h5>💡 Recommendations to Bridge the Gap:</h5>
            <ul>
                <li><strong>Option 1:</strong> Increase target corpus to ${formatCurrency(additionalCorpusNeeded)} (requires ${formatCurrency(requiredMonthlySIP + additionalSIPNeeded)} monthly SIP)</li>
                <li><strong>Option 2:</strong> Extend retirement age by ${Math.ceil(shortage * 12 / desiredMonthlyIncome)} years</li>
                <li><strong>Option 3:</strong> Accept ${formatCurrency(sustainableIncome)} monthly income</li>
                <li><strong>Option 4:</strong> Increase expected withdrawal returns to ${(withdrawalReturn + 1).toFixed(1)}% or higher</li>
            </ul>
        `;
    }
    
    document.getElementById('retirement-results').classList.remove('hidden');
}

// Investment Comparison
function addComparator() {
    const years = parseFloat(document.getElementById('comparison-years').value);
    if (!years) {
        alert('Please enter investment period first');
        return;
    }
    
    const comparatorId = Date.now();
    const comparatorHtml = `
        <div class="comparator" data-id="${comparatorId}">
            <button class="remove-comparator" onclick="removeComparator(${comparatorId})">×</button>
            <h4>Investment Option ${comparators.length + 1}</h4>
            <div class="input-section">
                <div class="input-group">
                    <label>Investment Name</label>
                    <input type="text" class="investment-name" placeholder="e.g., Mutual Fund SIP">
                </div>
                <div class="input-group">
                    <label>Monthly Investment (₹)</label>
                    <input type="number" class="monthly-investment" placeholder="e.g., 5000">
                </div>
                <div class="input-group">
                    <label>Expected Annual Return (%)</label>
                    <input type="number" class="expected-return" step="0.01" placeholder="e.g., 12">
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('comparators-container').insertAdjacentHTML('beforeend', comparatorHtml);
    comparators.push(comparatorId);
    document.getElementById('compare-btn').style.display = 'block';
}

function removeComparator(id) {
    document.querySelector(`[data-id="${id}"]`).remove();
    comparators = comparators.filter(c => c !== id);
    
    if (comparators.length === 0) {
        document.getElementById('compare-btn').style.display = 'none';
        document.getElementById('comparison-results').classList.add('hidden');
    }
    
    // Update numbering
    document.querySelectorAll('.comparator h4').forEach((h4, index) => {
        h4.textContent = `Investment Option ${index + 1}`;
    });
}

function compareInvestments() {
    const years = parseFloat(document.getElementById('comparison-years').value);
    const comparatorElements = document.querySelectorAll('.comparator');
    
    if (comparatorElements.length === 0) {
        alert('Please add at least one investment option');
        return;
    }
    
    let tableHtml = `
        <div class="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>Investment</th>
                        <th>Monthly Investment</th>
                        <th>Total Investment</th>
                        <th>Maturity Amount</th>
                        <th>Capital Gains</th>
                        <th>Annual Return</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    comparatorElements.forEach(element => {
        const name = element.querySelector('.investment-name').value || 'Unnamed Investment';
        const monthlyInvestment = parseFloat(element.querySelector('.monthly-investment').value);
        const annualReturn = parseFloat(element.querySelector('.expected-return').value);
        
        if (monthlyInvestment && annualReturn) {
            const months = years * 12;
            const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
            
            const maturityAmount = monthlyInvestment * 
                (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
            
            const totalInvestment = monthlyInvestment * months;
            const capitalGains = maturityAmount - totalInvestment;
            
            tableHtml += `
                <tr>
                    <td>${name}</td>
                    <td>${formatCurrency(monthlyInvestment)}</td>
                    <td>${formatCurrency(totalInvestment)}</td>
                    <td>${formatCurrency(maturityAmount)}</td>
                    <td>${formatCurrency(capitalGains)}</td>
                    <td>${annualReturn}%</td>
                </tr>
            `;
        }
    });
    
    tableHtml += '</tbody></table></div>';
    
    document.getElementById('comparison-table').innerHTML = tableHtml;
    document.getElementById('comparison-results').classList.remove('hidden');
}

// Enhanced Bill Splitter Functions - Fixed to not reset expenses when adding users
function setupGroup() {
    const membersInput = document.getElementById('group-members').value.trim();
    if (!membersInput) {
        alert('Please enter group members');
        return;
    }
    
    groupMembers = membersInput.split(',').map(name => name.trim()).filter(name => name);
    
    if (groupMembers.length < 2) {
        alert('Please enter at least 2 group members');
        return;
    }
    
    // Only clear expenses if this is the first setup, not when adding new members
    if (document.getElementById('expenses-section').classList.contains('hidden')) {
        expenses = [];
    }
    
    setupExpenseForm();
    document.getElementById('expenses-section').classList.remove('hidden');
    updateExpensesList();
}

function addNewMember() {
    const newMember = document.getElementById('new-member').value.trim();
    if (!newMember) {
        alert('Please enter a new member name');
        return;
    }
    
    if (groupMembers.includes(newMember)) {
        alert('Member already exists');
        return;
    }
    
    groupMembers.push(newMember);
    
    // Update current members input
    document.getElementById('group-members').value = groupMembers.join(', ');
    
    // Clear new member input
    document.getElementById('new-member').value = '';
    
    // Update expense form WITHOUT clearing expenses
    setupExpenseForm();
    
    // Recalculate results if they were showing
    if (!document.getElementById('split-results').classList.contains('hidden')) {
        calculateSplit();
    }
}

function setupExpenseForm() {
    const payerSelect = document.getElementById('expense-payer');
    const splitCheckboxes = document.getElementById('split-checkboxes');
    
    payerSelect.innerHTML = '';
    splitCheckboxes.innerHTML = '';
    
    groupMembers.forEach(member => {
        // Add to payer dropdown
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        payerSelect.appendChild(option);
        
        // Add to split checkboxes
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = member;
        checkbox.checked = true;
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(member));
        splitCheckboxes.appendChild(label);
    });
}

function addExpense() {
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const payer = document.getElementById('expense-payer').value;
    
    if (!description || !amount || !payer) {
        alert('Please fill in all expense details');
        return;
    }
    
    const splitAmong = Array.from(document.querySelectorAll('#split-checkboxes input:checked'))
                           .map(cb => cb.value);
    
    if (splitAmong.length === 0) {
        alert('Please select at least one person to split the expense among');
        return;
    }
    
    const expense = {
        id: Date.now(),
        description,
        amount,
        payer,
        splitAmong,
        perPersonAmount: amount / splitAmong.length
    };
    
    expenses.push(expense);
    
    // Clear form
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
    
    // Check all checkboxes by default for next expense
    document.querySelectorAll('#split-checkboxes input').forEach(cb => cb.checked = true);
    
    updateExpensesList();
}

function removeExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    updateExpensesList();
}

function updateExpensesList() {
    const expensesList = document.getElementById('expenses-list');
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p style="text-align: center; color: var(--text-gold);">No expenses added yet</p>';
        document.getElementById('calculate-split-btn').style.display = 'none';
        return;
    }
    
    let html = '<h4>Added Expenses:</h4>';
    expenses.forEach(expense => {
        html += `
            <div class="expense-item">
                <div class="expense-details">
                    <h4>${expense.description}</h4>
                    <p>Amount: ${formatCurrency(expense.amount)} | Paid by: ${expense.payer}</p>
                    <p>Split among: ${expense.splitAmong.join(', ')} (${formatCurrency(expense.perPersonAmount)} each)</p>
                </div>
                <button class="remove-expense" onclick="removeExpense(${expense.id})">Remove</button>
            </div>
        `;
    });
    
    expensesList.innerHTML = html;
    document.getElementById('calculate-split-btn').style.display = 'block';
}

function calculateSplit() {
    if (expenses.length === 0) {
        alert('Please add at least one expense');
        return;
    }
    
    // Calculate balances for each member
    const balances = {};
    groupMembers.forEach(member => {
        balances[member] = 0;
    });
    
    // Process each expense
    expenses.forEach(expense => {
        // Payer gets credited
        balances[expense.payer] += expense.amount;
        
        // Each person in split gets debited their share
        expense.splitAmong.forEach(person => {
            balances[person] -= expense.perPersonAmount;
        });
    });
    
    // Display individual balances
    let individualHtml = '<h4>Individual Balances:</h4>';
    Object.entries(balances).forEach(([member, balance]) => {
        const balanceText = balance > 0 ? 
            `Should receive ${formatCurrency(Math.abs(balance))}` :
            balance < 0 ? 
            `Owes ${formatCurrency(Math.abs(balance))}` :
            'Settled';
        
        const balanceClass = balance > 0 ? 'positive' : balance < 0 ? 'negative' : '';
        
        individualHtml += `
            <div class="result-item">
                <span class="label">${member}:</span>
                <span class="value ${balanceClass}">${balanceText}</span>
            </div>
        `;
    });
    
    document.getElementById('individual-balances').innerHTML = individualHtml;
    
    // Calculate net settlements
    const creditors = Object.entries(balances).filter(([_, balance]) => balance > 0);
    const debtors = Object.entries(balances).filter(([_, balance]) => balance < 0);
    
    let settlementHtml = '<h4>Settlement Instructions:</h4>';
    
    if (creditors.length === 0 && debtors.length === 0) {
        settlementHtml += '<p style="text-align: center;">Everyone is settled! 🎉</p>';
    } else {
        // Simple settlement algorithm
        const settlements = [];
        const creditorsRemaining = [...creditors];
        const debtorsRemaining = [...debtors];
        
        while (creditorsRemaining.length > 0 && debtorsRemaining.length > 0) {
            const [creditor, creditAmount] = creditorsRemaining[0];
            const [debtor, debtAmount] = debtorsRemaining[0];
            
            const settleAmount = Math.min(creditAmount, Math.abs(debtAmount));
            
            settlements.push({
                from: debtor,
                to: creditor,
                amount: settleAmount
            });
            
            // Update remaining amounts
            creditorsRemaining[0][1] -= settleAmount;
            debtorsRemaining[0][1] += settleAmount;
            
            // Remove if settled
            if (creditorsRemaining[0][1] === 0) creditorsRemaining.shift();
            if (debtorsRemaining[0][1] === 0) debtorsRemaining.shift();
        }
        
        settlements.forEach(settlement => {
            settlementHtml += `
                <div class="settlement-item">
                    ${settlement.from} pays ${formatCurrency(settlement.amount)} to ${settlement.to}
                </div>
            `;
        });
    }
    
    document.getElementById('settlement-instructions').innerHTML = settlementHtml;
    document.getElementById('split-results').classList.remove('hidden');
}

// Card Analysis Functions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        parseCSV(csv);
    };
    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    if (lines.length < 2) {
        alert('CSV file appears to be empty or invalid');
        return;
    }
    
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Reset transactions array
    transactions = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        
        // Try to find date, description, and amount columns
        let dateIndex = headers.findIndex(h => h.includes('date'));
        let descIndex = headers.findIndex(h => h.includes('description') || h.includes('desc') || h.includes('merchant') || h.includes('details'));
        let amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('debit') || h.includes('credit'));
        
        if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
            // Try with positional assumptions
            dateIndex = 0;
            descIndex = 1;
            amountIndex = 2;
        }
        
        const transaction = {
            id: Date.now() + i,
            date: values[dateIndex] || '',
            description: values[descIndex] || 'Unknown Transaction',
            amount: Math.abs(parseFloat(values[amountIndex]) || 0)
        };
        
        if (transaction.description && transaction.amount > 0) {
            transaction.category = categorizeTransaction(transaction.description);
            transactions.push(transaction);
        }
    }
    
    if (transactions.length > 0) {
        analyzeTransactions();
        alert(`Successfully loaded ${transactions.length} transactions!`);
    } else {
        alert('No valid transactions found in the file. Please check the format (Date, Description, Amount).');
    }
}

function addManualTransaction() {
    const date = document.getElementById('transaction-date').value;
    const description = document.getElementById('transaction-description').value.trim();
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    
    if (!date || !description || !amount || amount <= 0) {
        alert('Please fill in all transaction details with a positive amount');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        date,
        description,
        amount,
        category: categorizeTransaction(description)
    };
    
    transactions.push(transaction);
    
    // Clear form
    document.getElementById('transaction-date').value = '';
    document.getElementById('transaction-description').value = '';
    document.getElementById('transaction-amount').value = '';
    
    // Show immediate feedback
    alert(`Transaction added: ${description} - ${formatCurrency(amount)} (Category: ${transaction.category})`);
    
    analyzeTransactions();
}

function categorizeTransaction(description) {
    const desc = description.toLowerCase();
    
    // Food & Dining
    if (desc.includes('restaurant') || desc.includes('food') || desc.includes('zomato') || 
        desc.includes('swiggy') || desc.includes('cafe') || desc.includes('pizza') || 
        desc.includes('kfc') || desc.includes('mcdonald') || desc.includes('domino') ||
        desc.includes('grocery') || desc.includes('bigbasket') || desc.includes('grofers') ||
        desc.includes('dining') || desc.includes('eatery') || desc.includes('meal') ||
        desc.includes('breakfast') || desc.includes('lunch') || desc.includes('dinner')) {
        return 'Food & Dining';
    }
    
    // Bills & Utilities
    if (desc.includes('recharge') || desc.includes('mobile') || desc.includes('electricity') || 
        desc.includes('water') || desc.includes('gas') || desc.includes('internet') || 
        desc.includes('broadband') || desc.includes('airtel') || desc.includes('jio') || 
        desc.includes('bsnl') || desc.includes('vi') || desc.includes('bill payment') ||
        desc.includes('utility') || desc.includes('phone') || desc.includes('telecom')) {
        return 'Bills & Utilities';
    }
    
    // Petrol & Transportation
    if (desc.includes('petrol') || desc.includes('fuel') || desc.includes('gas station') || 
        desc.includes('uber') || desc.includes('ola') || desc.includes('cab') || 
        desc.includes('taxi') || desc.includes('metro') || desc.includes('bus') || 
        desc.includes('parking') || desc.includes('toll') || desc.includes('transport') ||
        desc.includes('auto') || desc.includes('rickshaw') || desc.includes('train')) {
        return 'Petrol & Transportation';
    }
    
    // Shopping & Entertainment
    if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('myntra') || 
        desc.includes('shopping') || desc.includes('mall') || desc.includes('store') || 
        desc.includes('movie') || desc.includes('cinema') || desc.includes('netflix') || 
        desc.includes('spotify') || desc.includes('game') || desc.includes('entertainment') ||
        desc.includes('theatre') || desc.includes('music') || desc.includes('book') ||
        desc.includes('clothing') || desc.includes('electronics')) {
        return 'Shopping & Entertainment';
    }
    
    // Healthcare
    if (desc.includes('pharmacy') || desc.includes('hospital') || desc.includes('doctor') || 
        desc.includes('medical') || desc.includes('health') || desc.includes('medicine') || 
        desc.includes('apollo') || desc.includes('clinic') || desc.includes('dentist') ||
        desc.includes('diagnostic') || desc.includes('lab test')) {
        return 'Healthcare';
    }
    
    // Default to Miscellaneous
    return 'Miscellaneous';
}

function analyzeTransactions() {
    if (transactions.length === 0) {
        alert('Please add some transactions first');
        return;
    }
    
    // Group by category
    const categoryTotals = {};
    transactions.forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
    });
    
    // Group by month
    const monthlyTotals = {};
    transactions.forEach(transaction => {
        try {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyTotals[month]) {
                monthlyTotals[month] = 0;
            }
            monthlyTotals[month] += transaction.amount;
        } catch (e) {
            // If date parsing fails, use 'Unknown' as month
            if (!monthlyTotals['Unknown']) {
                monthlyTotals['Unknown'] = 0;
            }
            monthlyTotals['Unknown'] += transaction.amount;
        }
    });
    
    // Create charts
    createCategoryChart(categoryTotals);
    createMonthlyChart(monthlyTotals);
    
    // Create summary table
    createCategorySummary(categoryTotals);
    
    // Display recent transactions
    displayRecentTransactions();
    
    document.getElementById('analysis-results').classList.remove('hidden');
}

function createCategoryChart(categoryTotals) {
    const ctx = document.getElementById('category-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.categoryChart) {
        window.categoryChart.destroy();
    }
    
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
    
    window.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: colors.slice(0, Object.keys(categoryTotals).length),
                borderWidth: 2,
                borderColor: '#1a1a1a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Spending by Category',
                    color: '#FFD700',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    labels: {
                        color: '#F5DEB3'
                    }
                }
            }
        }
    });
}

function createMonthlyChart(monthlyTotals) {
    const ctx = document.getElementById('monthly-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.monthlyChart) {
        window.monthlyChart.destroy();
    }
    
    window.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyTotals),
            datasets: [{
                label: 'Monthly Spending',
                data: Object.values(monthlyTotals),
                backgroundColor: '#1FB8CD',
                borderColor: '#FFC185',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Spending Trend',
                    color: '#FFD700',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    labels: {
                        color: '#F5DEB3'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#F5DEB3',
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(245, 222, 179, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#F5DEB3'
                    },
                    grid: {
                        color: 'rgba(245, 222, 179, 0.1)'
                    }
                }
            }
        }
    });
}

function createCategorySummary(categoryTotals) {
    const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    let summaryHtml = `
        <h4>Category Summary (Total Transactions: ${transactions.length})</h4>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount Spent</th>
                    <th>Percentage</th>
                    <th>Transactions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, amount]) => {
            const percentage = ((amount / totalSpending) * 100).toFixed(1);
            const transactionCount = transactions.filter(t => t.category === category).length;
            
            summaryHtml += `
                <tr>
                    <td>${category}</td>
                    <td>${formatCurrency(amount)}</td>
                    <td>${percentage}%</td>
                    <td>${transactionCount}</td>
                </tr>
            `;
        });
    
    summaryHtml += `
            </tbody>
        </table>
        <div class="result-item highlight" style="margin-top: 16px;">
            <span class="label">Total Spending:</span>
            <span class="value">${formatCurrency(totalSpending)}</span>
        </div>
    `;
    
    document.getElementById('category-summary').innerHTML = summaryHtml;
}

function displayRecentTransactions() {
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);
    
    let transactionsHtml = '';
    recentTransactions.forEach(transaction => {
        const formattedDate = transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Unknown Date';
        
        transactionsHtml += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-date">${formattedDate}</div>
                    <div class="transaction-desc">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category}</div>
                </div>
                <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
            </div>
        `;
    });
    
    document.getElementById('transactions-table').innerHTML = transactionsHtml;
}