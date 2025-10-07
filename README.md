# HG Financial Calculator

> **Complete Financial Planning & Analysis Suite**

A comprehensive financial calculator web application that provides all essential financial planning tools in one place. Built with modern web technologies and designed for both beginners and financial professionals.

![HG Financial Calculator](https://img.shields.io/badge/Version-4.1-gold?style=for-the-badge) ![Built with Love](https://img.shields.io/badge/Built%20with-❤️-red?style=for-the-badge) ![Open Source](https://img.shields.io/badge/Open-Source-green?style=for-the-badge)

## 🌟 Features

### 📊 **EMI Calculator**
- Calculate loan EMI with precision
- Interest calculation and amortization schedule
- Support for various loan types (home, personal, car, etc.)

### 🏠 **Multiple Prepayments Calculator**
- Plan multiple prepayments at different years
- Choose between "Reduce Tenure" vs "Reduce EMI" strategies
- Year-by-year impact analysis with detailed tables
- Separate analysis for time savings and EMI savings

### 📈 **SIP & Lumpsum Calculator**
- **SIP Only**: Groww methodology with step-up SIP support
- **Lumpsum Only**: Compound interest calculations
- **Combined**: SIP + Lumpsum investment planning
- Real-time wealth multiplier calculations

### 📉 **SWP Calculator**
- Systematic Withdrawal Plan analysis
- Sustainability verification for desired withdrawal period
- Month-by-month simulation with return calculations

### 💎 **Wealth Calculator**
- **Goal Planning**: Calculate required SIP for financial goals
- **Retirement Planning**: Two-phase analysis (accumulation + sustainability)
- **Investment Comparison**: Compare multiple investment options with rankings

### 💰 **Bill Splitter**
- Smart group expense management
- Multiple expense tracking with different payers
- Optimized settlement calculations
- Net balance analysis for fair splits

### 📊 **Card Analysis & Spending Tracker**
- Upload transaction CSV files for automatic analysis
- Smart categorization into 6+ spending categories
- Visual spending breakdown with charts
- Monthly trend analysis and insights
- Detailed spending patterns and recommendations

## 🚀 Live Demo

**[Try HG Financial Calculator](https://hemachandgogula.github.io/hg-financial-calculator)**

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Design**: Responsive design with CSS Grid & Flexbox
- **Performance**: Optimized calculations with debouncing
- **Compatibility**: Works on all modern browsers

## 📱 Screenshots

### Desktop View
![Desktop Screenshot](screenshots/desktop-view.png)

### Mobile View
![Mobile Screenshot](screenshots/mobile-view.png)

### Calculator Features
![Features Screenshot](screenshots/features.png)

## 🔧 Installation & Setup

### Option 1: Direct Download
1. Download the project files
2. Open `index.html` in your web browser
3. Start calculating!

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/hemachandgogula/hg-financial-calculator.git

# Navigate to project directory
cd hg-financial-calculator

# Open in browser (or use a local server)
# For Python 3
python -m http.server 8000

# For Node.js (if you have live-server installed)
npx live-server

# Then open http://localhost:8000
```

### Option 3: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/" (root)
5. Your calculator will be live at `https://yourusername.github.io/hg-financial-calculator`

## 🌐 Deployment

### Netlify (Quick Deploy)
1. Fork this repository
2. Connect your GitHub account to Netlify
3. Deploy from the main branch
4. Your app will be live with a custom URL

### Vercel
1. Import project from GitHub
2. No configuration needed
3. Automatic deployments on every push

### Traditional Web Hosting
1. Upload all files to your hosting provider
2. Ensure `index.html` is in the root directory
3. Access via your domain

## 📖 User Guide

### EMI Calculator
1. Enter loan amount, interest rate, and tenure
2. View monthly EMI and total interest payable
3. Analyze total cost vs principal amount

### Multiple Prepayments
1. Add multiple prepayment amounts for different years
2. Choose your strategy: reduce tenure or reduce EMI
3. Compare both time savings and EMI savings
4. View year-by-year breakdown

### SIP Planning
1. Select investment type (SIP only, Lumpsum only, or Combined)
2. Enter monthly amount and expected returns
3. Add annual step-up percentage for SIP
4. View maturity value and wealth multiplier

### Transaction Analysis
1. Export transactions from your bank/credit card (CSV format)
2. Upload the file using drag-and-drop or file picker
3. View automatic categorization and spending insights
4. Analyze trends with interactive charts

## 🎨 Customization

### Themes
The calculator uses a premium black & gold theme. To customize:

1. **Colors**: Edit CSS variables in `styles.css`
2. **Layout**: Modify grid layouts and spacing
3. **Typography**: Change font families and sizes

### Adding New Calculators
1. Add new tab button in navigation
2. Create corresponding HTML section
3. Implement calculation logic in `script.js`
4. Style the new components in `styles.css`

## 🧪 Testing

### Manual Testing Checklist
- [ ] All calculators produce accurate results
- [ ] Responsive design works on mobile/tablet
- [ ] File upload functionality works
- [ ] Charts render properly
- [ ] Form validation prevents errors
- [ ] Tab navigation works smoothly

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📊 File Structure

```
hg-financial-calculator/
├── index.html              # Main HTML file
├── styles.css              # CSS styling
├── script.js               # JavaScript functionality
├── README.md              # Project documentation
├── favicon.ico            # Website icon
└── screenshots/           # Application screenshots
    ├── desktop-view.png
    ├── mobile-view.png
    └── features.png
```

## 🔒 Security & Privacy

- **No Data Storage**: All calculations happen locally in your browser
- **No Server Communication**: Pure client-side application
- **Privacy First**: Uploaded files are processed locally, not sent to servers
- **Secure**: No external dependencies except Chart.js CDN

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Test all calculators for accuracy
- Ensure responsive design compatibility
- Add comments for complex calculations
- Update README if adding new features

## 📈 Roadmap

### Version 5.0 (Planned)
- [ ] Dark/Light theme toggle
- [ ] Export results to PDF
- [ ] Advanced tax calculations
- [ ] Investment portfolio tracker
- [ ] Cryptocurrency calculator
- [ ] Multi-language support

### Future Enhancements
- [ ] PWA (Progressive Web App) support
- [ ] Offline functionality
- [ ] Data backup/restore
- [ ] Advanced charts and analytics
- [ ] Integration with popular financial APIs

## 📋 Changelog

### v4.1 (Current)
- ✅ Complete redesign with premium theme
- ✅ Added Multiple Prepayments Calculator
- ✅ Enhanced Retirement Planning (two-phase)
- ✅ Card Analysis with spending categorization
- ✅ Improved mobile responsiveness
- ✅ Bug fixes and performance optimizations

### v4.0
- ✅ Added SWP Calculator
- ✅ Investment Comparison tool
- ✅ Bill Splitter functionality
- ✅ Groww methodology for SIP calculations
- ✅ Enhanced UI/UX design

### v3.0
- ✅ SIP & Lumpsum Calculator
- ✅ Goal Planning tools
- ✅ Responsive design implementation

## ❓ FAQ

**Q: Is this calculator accurate for real financial planning?**
A: Yes, all calculators use standard financial formulas. However, consult a financial advisor for major decisions.

**Q: Can I use this offline?**
A: Yes, once loaded, the calculator works offline. Only the initial load requires internet for Chart.js.

**Q: Is my financial data secure?**
A: Absolutely. All calculations happen in your browser. No data is sent to external servers.

**Q: Can I customize the calculators?**
A: Yes! The code is open source and fully customizable. Modify calculations, styling, or add new features.

**Q: Does it work on mobile devices?**
A: Yes, the calculator is fully responsive and optimized for mobile, tablet, and desktop use.

## 🐛 Bug Reports

Found a bug? Please help us improve:

1. **Check** existing issues on GitHub
2. **Create** a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and device information
   - Screenshots if applicable

## 🏆 Acknowledgments

- **Chart.js** - For beautiful and responsive charts
- **Financial Formulas** - Standard mathematical formulas for accurate calculations
- **Community Feedback** - Valuable suggestions and bug reports
- **Open Source Community** - Inspiration and best practices

## 📞 Contact & Support

**Hemachand Gogula**
- 📧 **Email**: [hemachandgogula@gmail.com](mailto:hemachandgogula@gmail.com)
- 💼 **LinkedIn**: [linkedin.com/in/hemachandgogula](https://www.linkedin.com/in/hemachandgogula/)
- 👨‍💻 **GitHub**: [github.com/hemachandgogula](https://github.com/hemachandgogula)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hemachandgogula/hg-financial-calculator&type=Date)](https://star-history.com/#hemachandgogula/hg-financial-calculator&Date)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Hemachand Gogula

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by [Hemachand Gogula](https://www.linkedin.com/in/hemachandgogula/)**

*Making financial planning accessible to everyone*

**[⭐ Star this repo](https://github.com/hemachandgogula/hg-financial-calculator) if you found it helpful!**

</div>