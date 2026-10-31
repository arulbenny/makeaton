import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, CreditCard, FileText, Users, 
  CheckCircle, Clock, AlertCircle, Plus, Search, Download, 
  RefreshCw, Pause, Play, Shield, DollarSign, ArrowUpRight,
  UserCheck, Eye, X, Filter, LogOut, Phone, User, Lock, KeyRound, Sparkles,
  Calendar, AlertTriangle, Send, Loader2, Layers, Zap, CheckCircle2, Inbox,
  ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Check, Flame, TrendingUp, Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';

// User Database Mapping
const MOCK_USERS_DB = [
  { name: 'Anwin', phone: '8547719463', role: 'admin' },
  { name: 'Arul', phone: '9876543211', role: 'staff' },
  { name: 'Abin', phone: '9876543222', role: 'staff' },
];

const INITIAL_PRODUCTS = [
  { id: 'prod_1', name: 'Brightloop Billing ERP', category: 'Software', basePrice: 4999, billingCycle: 'Monthly', status: 'Active', description: 'Complete automated subscription & invoicing engine.', features: ['Multi-currency engine', 'Automated dunning', 'Custom Webhooks', 'API Access'], popular: true },
  { id: 'prod_2', name: 'Analytics & Insights Module', category: 'Add-on', basePrice: 1999, billingCycle: 'Monthly', status: 'Active', description: 'Advanced MRR forecasting & cohort churn analysis.', features: ['Real-time cohorts', 'CSV Export', 'Custom Dashboards'], popular: false },
  { id: 'prod_3', name: 'POS Hardware Terminal', category: 'Hardware', basePrice: 14999, billingCycle: 'One-time', status: 'Active', description: 'Touchscreen POS terminal with instant sync.', features: ['NFC Payment Support', 'Thermal Printer', 'Offline Cache Mode'], popular: false },
  { id: 'prod_4', name: 'Enterprise Cloud Backup (1TB)', category: 'Add-on', basePrice: 2999, billingCycle: 'Monthly', status: 'Active', description: 'Encrypted offsite database replication.', features: ['99.99% Uptime SLA', 'AES-256 Encryption', '24/7 Priority Recovery'], popular: false },
];

const INITIAL_SUBSCRIPTIONS = [
  { id: 'SUB-1001', customer: 'Arun Kumar', email: 'arun@techcorp.in', plan: 'Brightloop Billing ERP', status: 'Active', amount: 4999, cycle: 'Monthly', startDate: '2026-01-15', expiryDate: '2026-11-15', autoRenew: true, paymentMethod: 'UPI (HDFC)' },
  { id: 'SUB-1002', customer: 'Priya Sharma', email: 'priya@innovate.io', plan: 'Analytics & Insights Module', status: 'Active', amount: 1999, cycle: 'Monthly', startDate: '2026-03-01', expiryDate: '2026-11-01', autoRenew: true, paymentMethod: 'Credit Card (Visa)' },
  { id: 'SUB-1003', customer: 'Rohan Gupta', email: 'rohan@retailhub.com', plan: 'Brightloop Billing ERP', status: 'Paused', amount: 4999, cycle: 'Monthly', startDate: '2026-02-10', expiryDate: '2026-11-10', autoRenew: false, paymentMethod: 'Net Banking' },
  { id: 'SUB-1004', customer: 'Apex Logistics', email: 'billing@apexlog.com', plan: 'Enterprise Suite', status: 'Draft', amount: 14999, cycle: 'Yearly', startDate: '2026-10-28', expiryDate: '2027-10-28', autoRenew: true, paymentMethod: 'Wire Transfer' },
  { id: 'SUB-1005', customer: 'Anita Roy', email: 'anita@designco.in', plan: 'Analytics & Insights Module', status: 'Closed', amount: 1999, cycle: 'Monthly', startDate: '2025-11-01', expiryDate: '2026-10-01', autoRenew: false, paymentMethod: 'UPI (GPay)' },
];

const CLIENT_DEMO_SUBSCRIPTIONS = [
  { id: 'SUB-2001', plan: 'Brightloop Billing ERP (Pro)', status: 'Active', amount: 4999, cycle: 'Monthly', startDate: '2026-01-15', expiryDate: '2026-11-15', autoRenew: true, usage: 84 },
  { id: 'SUB-2002', plan: 'Analytics & Insights Add-on', status: 'Active', amount: 1999, cycle: 'Monthly', startDate: '2026-03-01', expiryDate: '2026-11-05', autoRenew: true, usage: 62 },
  { id: 'SUB-2003', plan: 'Cloud Storage (500GB)', status: 'Expired', amount: 999, cycle: 'Monthly', startDate: '2025-06-01', expiryDate: '2026-09-30', autoRenew: false, usage: 100 },
];

const INITIAL_INVOICES = [
  { id: 'INV-2026-089', customer: 'Arun Kumar', amount: 4999, date: '2026-10-15', dueDate: '2026-10-25', status: 'Paid', method: 'UPI' },
  { id: 'INV-2026-090', customer: 'Priya Sharma', amount: 1999, date: '2026-10-01', dueDate: '2026-10-11', status: 'Paid', method: 'Card' },
  { id: 'INV-2026-091', customer: 'Apex Logistics', amount: 14999, date: '2026-10-28', dueDate: '2026-11-07', status: 'Pending', method: '-' },
  { id: 'INV-2026-092', customer: 'Vikram Mehta', amount: 4999, date: '2026-09-15', dueDate: '2026-09-25', status: 'Overdue', method: '-' },
];

const REVENUE_DATA = [
  { month: 'May', revenue: 420000 },
  { month: 'Jun', revenue: 510000 },
  { month: 'Jul', revenue: 680000 },
  { month: 'Aug', revenue: 740000 },
  { month: 'Sep', revenue: 890000 },
  { month: 'Oct', revenue: 984000 },
];

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Auth State
  const [authStep, setAuthStep] = useState('phone'); 
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Dashboard Data State
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [clientSubscriptions, setClientSubscriptions] = useState(CLIENT_DEMO_SUBSCRIPTIONS);
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'REQ-501', clientName: 'Rohan Gupta', plan: 'Enterprise Cloud Backup (1TB)', amount: 2999, date: '2026-10-30', status: 'Pending Approval' }
  ]);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [products] = useState(INITIAL_PRODUCTS);
  
  // Interactive Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedSubId, setExpandedSubId] = useState(null);
  const [reqBillingCycle, setReqBillingCycle] = useState('Monthly');

  // Modals
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isClientReqModalOpen, setIsClientReqModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newSub, setNewSub] = useState({ customer: '', email: '', plan: INITIAL_PRODUCTS[0].name, amount: 4999 });
  const [selectedReqPlan, setSelectedReqPlan] = useState(INITIAL_PRODUCTS[0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const navigateTab = (tabName) => {
    if (tabName === currentTab) return;
    setIsTabLoading(true);
    setTimeout(() => {
      setCurrentTab(tabName);
      setIsTabLoading(false);
    }, 200);
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (inputPhone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    const trimmedName = inputName.trim().toLowerCase();
    const trimmedPhone = inputPhone.trim();

    let userRole = 'customer';
    if (trimmedName === 'anwin' || trimmedPhone === '8547719463') {
      userRole = 'admin';
    } else if (trimmedName === 'arul' || trimmedName === 'abin') {
      userRole = 'staff';
    }

    const detectedUser = {
      name: inputName.trim() || 'Valued User',
      phone: trimmedPhone,
      role: userRole
    };

    setCurrentUser(detectedUser);
    setAuthStep('otp');
    setOtpError('');
    showNotification(`Verification SMS sent to +91 ${trimmedPhone}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === '1000') {
      setIsAppLoading(true);
      setTimeout(() => {
        setAuthStep('authenticated');
        if (currentUser.role === 'customer') {
          setCurrentTab('portal');
        } else {
          setCurrentTab('dashboard');
        }
        setIsAppLoading(false);
        showNotification(`Welcome back, ${currentUser.name}! Authorized as ${currentUser.role.toUpperCase()}`);
      }, 500);
    } else {
      setOtpError('Invalid OTP! Enter 1000 for verification.');
    }
  };

  const quickLogin = (name, phone) => {
    setInputName(name);
    setInputPhone(phone);
  };

  const handleLogout = () => {
    setIsAppLoading(true);
    setTimeout(() => {
      setAuthStep('phone');
      setCurrentUser(null);
      setInputName('');
      setInputPhone('');
      setEnteredOtp('');
      setIsAppLoading(false);
    }, 300);
  };

  const toggleClientAutoRenew = (subId) => {
    setClientSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const nextState = !s.autoRenew;
        showNotification(`Auto-Renew for ${s.plan} ${nextState ? 'ENABLED' : 'DISABLED'}`);
        return { ...s, autoRenew: nextState };
      }
      return s;
    }));
  };

  const handleClientSubmitRequest = (e) => {
    e.preventDefault();
    const calculatedAmount = reqBillingCycle === 'Yearly' 
      ? Math.round(selectedReqPlan.basePrice * 12 * 0.8) 
      : selectedReqPlan.basePrice;

    const newReq = {
      id: `REQ-${500 + pendingRequests.length + 1}`,
      clientName: currentUser?.name || 'Client User',
      plan: `${selectedReqPlan.name} (${reqBillingCycle})`,
      amount: calculatedAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Approval'
    };

    setPendingRequests([newReq, ...pendingRequests]);
    setIsClientReqModalOpen(false);
    showNotification(`Request for "${selectedReqPlan.name}" submitted!`);
  };

  const handleApproveRequest = (reqId) => {
    const req = pendingRequests.find(r => r.id === reqId);
    if (!req) return;

    const approvedSub = {
      id: `SUB-${1000 + subscriptions.length + 1}`,
      customer: req.clientName,
      email: `${req.clientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      plan: req.plan,
      status: 'Active',
      amount: req.amount,
      cycle: req.plan.includes('Yearly') ? 'Yearly' : 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-11-30',
      autoRenew: true,
      paymentMethod: 'UPI'
    };

    setSubscriptions([approvedSub, ...subscriptions]);
    setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
    showNotification(`Approved & Activated subscription for ${req.clientName}!`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/30',
      Draft: 'bg-amber-500/10 text-amber-600 border-amber-400/30',
      Paused: 'bg-blue-500/10 text-blue-600 border-blue-400/30',
      Closed: 'bg-slate-500/10 text-slate-600 border-slate-400/30',
      Expired: 'bg-rose-500/10 text-rose-600 border-rose-400/30',
      Paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/30',
      Pending: 'bg-amber-500/10 text-amber-600 border-amber-400/30',
      Overdue: 'bg-rose-500/10 text-rose-600 border-rose-400/30',
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 w-fit ${styles[status] || 'bg-gray-100'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${
          status === 'Active' || status === 'Paid' ? 'bg-emerald-500 animate-pulse' :
          status === 'Draft' || status === 'Pending' ? 'bg-amber-500' :
          status === 'Paused' ? 'bg-blue-500' : 'bg-rose-500'
        }`}></span>
        {status}
      </span>
    );
  };

  const handleStatusChange = (subId, newStatus) => {
    setSubscriptions(prev => prev.map(sub => sub.id === subId ? { ...sub, status: newStatus } : sub));
    showNotification(`Subscription ${subId} set to ${newStatus}`);
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    const created = {
      id: `SUB-${1000 + subscriptions.length + 1}`,
      customer: newSub.customer,
      email: newSub.email,
      plan: newSub.plan,
      status: 'Draft',
      amount: Number(newSub.amount),
      cycle: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-11-01',
      autoRenew: true,
      paymentMethod: 'UPI'
    };
    setSubscriptions([created, ...subscriptions]);
    setIsSubModalOpen(false);
    setNewSub({ customer: '', email: '', plan: INITIAL_PRODUCTS[0].name, amount: 4999 });
    showNotification(`Draft Subscription created for ${created.customer}`);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: 'Paid', method: 'UPI' } : inv));
    setIsPayModalOpen(false);
    showNotification(`Payment recorded for Invoice ${selectedInvoice.id}`);
  };

  const exportToCSV = () => {
    const headers = ["Subscription ID", "Customer", "Plan", "Status", "Amount (INR)", "Expiration Date"];
    const rows = subscriptions.map(s => [s.id, s.customer, s.plan, s.status, s.amount, s.expiryDate]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Brightloop_Subscriptions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Report downloaded successfully.");
  };

  const BrandLogo = () => (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition duration-300">
        <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
          <Layers className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition duration-300" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="font-black text-xl leading-none tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Brightloop</h1>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-indigo-500/30 font-bold">v2.5</span>
        </div>
        <p className="text-[11px] text-indigo-300/70 font-medium tracking-wide">Subscription Operating System</p>
      </div>
    </div>
  );

  const activeSubsCount = subscriptions.filter(s => s.status === 'Active').length;
  const totalMRR = subscriptions.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.amount, 0);
  const paidInvoicesCount = invoices.filter(i => i.status === 'Paid').length;
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  const clientActiveSubs = clientSubscriptions.filter(s => s.status === 'Active');
  const clientExpiredSubs = clientSubscriptions.filter(s => s.status === 'Expired' || s.status === 'Closed');
  const clientMonthlyExpense = clientActiveSubs.reduce((sum, s) => sum + s.amount, 0);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]"></div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-0.5 shadow-2xl shadow-indigo-500/50 animate-bounce">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">BRIGHTLOOP OS</h2>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
            <Loader2 className="w-4 h-4 animate-spin" /> Booting Core Modules...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900/90 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-500/40 text-sm flex items-center gap-3 animate-bounce">
          <div className="p-1 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* LOGIN & OTP VERIFICATION */}
      {authStep !== 'authenticated' ? (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] space-y-6 relative z-10">
            
            <div className="flex justify-center pb-2">
              <BrandLogo />
            </div>

            {authStep === 'phone' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="e.g. Anwin, Arul, Abin..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input 
                      type="tel" 
                      required
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="e.g. 8547719463"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" /> Request OTP Code
                </button>

                <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-indigo-400" /> Quick Demo Shortcuts:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button" 
                      onClick={() => quickLogin('Anwin', '8547719463')}
                      className="px-2 py-2.5 bg-slate-800/50 hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 text-xs rounded-xl text-center border border-slate-800 transition font-medium"
                    >
                      👑 Anwin (Admin)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => quickLogin('Arul', '9876543211')}
                      className="px-2 py-2.5 bg-slate-800/50 hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 text-xs rounded-xl text-center border border-slate-800 transition font-medium"
                    >
                      👥 Arul (Staff)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => quickLogin('Rohan', '9111122222')}
                      className="px-2 py-2.5 bg-slate-800/50 hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 text-xs rounded-xl text-center border border-slate-800 transition font-medium"
                    >
                      👤 Client
                    </button>
                  </div>
                </div>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-indigo-950/60 border border-indigo-500/30 p-4 rounded-2xl text-center space-y-1">
                  <p className="text-xs text-indigo-300">Verification SMS Sent to <span className="font-bold text-white">+91 {inputPhone}</span></p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block">Enter OTP</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      maxLength={6}
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 1000"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                    />
                  </div>
                </div>

                {otpError && <p className="text-xs text-rose-400 text-center font-medium">{otpError}</p>}

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify & Authorize Access
                </button>

                <button 
                  type="button" 
                  onClick={() => setAuthStep('phone')} 
                  className="w-full text-xs text-slate-400 hover:text-white transition text-center block pt-2 font-medium"
                >
                  ← Change Credentials
                </button>
              </form>
            )}

          </div>
        </div>
      ) : (

        /* MAIN DASHBOARD APPLICATION */
        <>
          <header className="bg-slate-900/90 backdrop-blur-xl text-white px-6 py-3.5 flex flex-wrap items-center justify-between border-b border-slate-800/80 sticky top-0 z-40 shadow-xl">
            <BrandLogo />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl text-xs border border-slate-700/80 shadow-inner">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-white">{currentUser?.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  currentUser?.role === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 
                  currentUser?.role === 'staff' ? 'bg-blue-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm'
                }`}>
                  {currentUser?.role}
                </span>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 rounded-xl text-xs transition border border-slate-700 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </header>

          <div className="flex flex-1 relative bg-slate-900">
            
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800/80 p-4 space-y-2">
              {currentUser?.role !== 'customer' ? (
                <>
                  <button 
                    onClick={() => navigateTab('dashboard')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                  <button 
                    onClick={() => navigateTab('subscriptions')} 
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${currentTab === 'subscriptions' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4" /> Subscriptions
                    </div>
                    {pendingRequests.length > 0 && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                        {pendingRequests.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => navigateTab('products')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${currentTab === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                  >
                    <Package className="w-4 h-4" /> Catalog Plans
                  </button>
                  <button 
                    onClick={() => navigateTab('invoices')} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${currentTab === 'invoices' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                  >
                    <FileText className="w-4 h-4" /> Invoices & Billing
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigateTab('portal')} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                >
                  <UserCheck className="w-4 h-4" /> My Subscriptions
                </button>
              )}
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-8 overflow-y-auto relative bg-slate-900 text-slate-100">
              
              {isTabLoading && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-2xl shadow-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> Loading...
                  </div>
                </div>
              )}

              {/* ADMIN / STAFF DASHBOARD VIEW */}
              {currentTab === 'dashboard' && currentUser?.role !== 'customer' && (
                <div className="space-y-6">
                  
                  {pendingRequests.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
                          <Inbox className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">New Subscription Request Pending ({pendingRequests.length})</h4>
                          <p className="text-xs text-slate-300">Client <span className="font-semibold text-amber-300">{pendingRequests[0].clientName}</span> requested plan: <span className="font-semibold text-indigo-300">{pendingRequests[0].plan}</span> (₹{pendingRequests[0].amount})</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleApproveRequest(pendingRequests[0].id)}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 transition duration-200 active:scale-95"
                      >
                        Approve & Activate Now
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h2>
                      <p className="text-xs text-slate-400">Real-time subscription metrics & growth trajectory</p>
                    </div>
                    <button 
                      onClick={exportToCSV}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition border border-slate-700 shadow-md"
                    >
                      <Download className="w-4 h-4" /> Export Report (CSV)
                    </button>
                  </div>

                  {/* Interactive Glowing Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-emerald-500/10 group">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Active Subscriptions</span>
                        <RefreshCw className="w-4 h-4 text-emerald-400 group-hover:rotate-180 transition duration-500" />
                      </div>
                      <div className="mt-3 text-3xl font-black text-white">{activeSubsCount}</div>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center mt-1 gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last month
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-indigo-500/10 group">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Recurring (MRR)</span>
                        <DollarSign className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="mt-3 text-3xl font-black text-white">₹{totalMRR.toLocaleString()}</div>
                      <span className="text-xs text-slate-400 mt-1 block">Target: ₹10,00,000</span>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-emerald-500/10 group">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Paid Invoices</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="mt-3 text-3xl font-black text-white">{paidInvoicesCount}</div>
                      <span className="text-xs text-slate-400 mt-1 block">100% processing rate</span>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/40 hover:shadow-rose-500/10 group">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Overdue Amount</span>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="mt-3 text-3xl font-black text-rose-400">₹{overdueAmount.toLocaleString()}</div>
                      <span className="text-xs text-rose-400 mt-1 block">Requires staff action</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80 shadow-xl">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" /> Revenue Growth Trajectory (₹)
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="month" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                          <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN / STAFF SUBSCRIPTIONS VIEW */}
              {currentTab === 'subscriptions' && currentUser?.role !== 'customer' && (
                <div className="space-y-6">
                  
                  {pendingRequests.length > 0 && (
                    <div className="bg-slate-950/80 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Inbox className="w-4 h-4 text-amber-400" /> Pending Client Requests ({pendingRequests.length})
                        </h3>
                        <span className="text-xs text-amber-400 font-mono">Action Required</span>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {pendingRequests.map(req => (
                          <div key={req.id} className="py-3 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-white text-sm">{req.clientName}</p>
                              <p className="text-xs text-slate-400">Requested: <span className="font-semibold text-indigo-400">{req.plan}</span> (₹{req.amount}) • {req.date}</p>
                            </div>
                            <button 
                              onClick={() => handleApproveRequest(req.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition active:scale-95"
                            >
                              Approve & Activate
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">Subscriptions Lifecycle</h2>
                      <p className="text-xs text-slate-400">Draft → Active → Paused / Closed</p>
                    </div>
                    <button 
                      onClick={() => setIsSubModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                    >
                      <Plus className="w-4 h-4" /> Create Subscription
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-3xl border border-slate-800/80 shadow-xl">
                    <div className="relative flex-1 min-w-[240px]">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Search by customer or plan..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl text-xs font-semibold border border-slate-800">
                      {['All', 'Active', 'Draft', 'Paused', 'Closed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1.5 rounded-lg transition ${filterStatus === status ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Subscriptions Table */}
                  <div className="bg-slate-950/60 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4">ID & Customer</th>
                          <th className="px-6 py-4">Plan</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Expiration Date</th>
                          <th className="px-6 py-4 text-right">Lifecycle Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {subscriptions
                          .filter(s => filterStatus === 'All' || s.status === filterStatus)
                          .filter(s => s.customer.toLowerCase().includes(searchQuery.toLowerCase()) || s.plan.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((sub) => {
                            const isExpanded = expandedSubId === sub.id;
                            return (
                              <React.Fragment key={sub.id}>
                                <tr 
                                  onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                                  className="hover:bg-slate-800/40 cursor-pointer transition"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                                      <div>
                                        <div className="font-bold text-white">{sub.customer}</div>
                                        <div className="text-[11px] text-slate-400">{sub.id} • {sub.email}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 font-semibold text-slate-200">{sub.plan}</td>
                                  <td className="px-6 py-4 font-black text-white">₹{sub.amount.toLocaleString()}</td>
                                  <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                                  <td className="px-6 py-4 text-slate-400">{sub.expiryDate}</td>
                                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2">
                                      {sub.status === 'Draft' && (
                                        <button onClick={() => handleStatusChange(sub.id, 'Active')} className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 shadow">
                                          Confirm & Activate
                                        </button>
                                      )}
                                      {sub.status === 'Active' && (
                                        <button onClick={() => handleStatusChange(sub.id, 'Paused')} className="px-2.5 py-1 text-xs bg-amber-500 text-slate-950 rounded-lg font-bold hover:bg-amber-400 shadow">
                                          Pause
                                        </button>
                                      )}
                                      {sub.status === 'Paused' && (
                                        <button onClick={() => handleStatusChange(sub.id, 'Active')} className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 shadow">
                                          Resume
                                        </button>
                                      )}
                                      {sub.status !== 'Closed' && (
                                        <button onClick={() => handleStatusChange(sub.id, 'Closed')} className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700">
                                          Close
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                
                                {isExpanded && (
                                  <tr className="bg-indigo-950/30">
                                    <td colSpan={6} className="px-8 py-4 border-t border-indigo-900/40">
                                      <div className="grid grid-cols-3 gap-4 text-xs">
                                        <div>
                                          <span className="font-semibold text-indigo-300 uppercase block mb-1">Billing Method</span>
                                          <p className="text-slate-300">Cycle: <span className="font-bold text-white">{sub.cycle}</span></p>
                                          <p className="text-slate-300">Payment: <span className="font-bold text-white">{sub.paymentMethod}</span></p>
                                        </div>
                                        <div>
                                          <span className="font-semibold text-indigo-300 uppercase block mb-1">Subscription Terms</span>
                                          <p className="text-slate-300">Start Date: <span className="font-bold text-white">{sub.startDate}</span></p>
                                          <p className="text-slate-300">Expiration: <span className="font-bold text-white">{sub.expiryDate}</span></p>
                                        </div>
                                        <div>
                                          <span className="font-semibold text-indigo-300 uppercase block mb-1">Auto-Renew Status</span>
                                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold border border-emerald-500/30">
                                            {sub.autoRenew ? 'ACTIVE' : 'OFF'}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PRODUCTS VIEW */}
              {currentTab === 'products' && currentUser?.role !== 'customer' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Products & Offerings</h2>
                    <p className="text-xs text-slate-400">Configure plans and feature tiers</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((prod) => (
                      <div key={prod.id} className="bg-slate-950/60 rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-xl relative hover:border-indigo-500/40 transition duration-300">
                        {prod.popular && (
                          <span className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase shadow">
                            MOST POPULAR
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                            {prod.category}
                          </span>
                          {getStatusBadge(prod.status)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{prod.name}</h3>
                          <p className="text-xs text-slate-400 mt-1">{prod.description}</p>
                          <p className="text-2xl font-black text-white mt-3">
                            ₹{prod.basePrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ {prod.billingCycle}</span>
                          </p>
                        </div>
                        <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                          {prod.features.map((feat, idx) => (
                            <p key={idx} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> {feat}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INVOICES VIEW */}
              {currentTab === 'invoices' && currentUser?.role !== 'customer' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Invoices & Billing History</h2>
                    <p className="text-xs text-slate-400">Track paid, pending, and overdue receipts</p>
                  </div>

                  <div className="bg-slate-950/60 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4">Invoice ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Due Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Payment Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-800/40">
                            <td className="px-6 py-4 font-bold text-white">{inv.id}</td>
                            <td className="px-6 py-4 text-slate-300">{inv.customer}</td>
                            <td className="px-6 py-4 font-black text-white">₹{inv.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-slate-400">{inv.dueDate}</td>
                            <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                            <td className="px-6 py-4 text-right">
                              {inv.status !== 'Paid' ? (
                                <button 
                                  onClick={() => { setSelectedInvoice(inv); setIsPayModalOpen(true); }}
                                  className="px-3 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 shadow"
                                >
                                  Record Payment
                                </button>
                              ) : (
                                <span className="text-xs text-slate-500">Paid via {inv.method}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ENHANCED CLIENT PORTAL VIEW */}
              {currentTab === 'portal' && (
                <div className="max-w-5xl space-y-6">
                  
                  {/* Glowing Client Hero Card */}
                  <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl shadow-2xl border border-indigo-500/30 flex flex-wrap items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-400/30">
                        VERIFIED CLIENT PORTAL
                      </span>
                      <h2 className="text-2xl font-black">Welcome back, {currentUser?.name}! 👋</h2>
                      <p className="text-indigo-200 text-xs">Logged in via +91 {currentUser?.phone}</p>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 mt-4 md:mt-0">
                      <div className="bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 px-5 py-2.5 rounded-2xl text-right">
                        <span className="text-[10px] text-indigo-300 block uppercase font-bold tracking-wider">Monthly Commitment</span>
                        <span className="text-2xl font-black text-white">₹{clientMonthlyExpense.toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => setIsClientReqModalOpen(true)}
                        className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xs transition shadow-lg shadow-indigo-600/40 flex items-center gap-2 active:scale-95"
                      >
                        <Plus className="w-4 h-4" /> Request New Plan
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Active Plans</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-white">{clientActiveSubs.length} Active</div>
                      <p className="text-xs text-slate-400 mt-1">Renews automatically each cycle</p>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Next Renewal</span>
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-amber-400">Nov 05, 2026</div>
                      <p className="text-xs text-slate-400 mt-1">Analytics & Insights Add-on</p>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800/80 shadow-xl">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Expired Plans</span>
                        <Clock className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-slate-400">{clientExpiredSubs.length} Plans</div>
                      <p className="text-xs text-slate-400 mt-1">Eligible for instant re-activation</p>
                    </div>
                  </div>

                  {/* Subscriptions with Auto-Renew Toggle Switches */}
                  <div className="bg-slate-950/60 rounded-3xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">My Active Subscriptions & Usage</h3>
                      <span className="text-xs text-slate-400 font-mono">Auto-Billing Controls</span>
                    </div>

                    <div className="space-y-4">
                      {clientSubscriptions.map((sub) => (
                        <div key={sub.id} className="border border-slate-800 rounded-2xl p-5 space-y-3 bg-slate-900/80 hover:border-slate-700 transition shadow-inner">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-base">{sub.plan}</h4>
                                {getStatusBadge(sub.status)}
                              </div>
                              <p className="text-xs text-slate-400 flex items-center gap-3">
                                <span>Start: {sub.startDate}</span>
                                <span>•</span>
                                <span className={sub.status === 'Active' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}>
                                  Expiration: {sub.expiryDate}
                                </span>
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-lg font-black text-white">₹{sub.amount.toLocaleString()}</p>
                                <p className="text-[11px] text-slate-400 font-mono">{sub.cycle}</p>
                              </div>

                              {sub.status === 'Active' ? (
                                <button 
                                  onClick={() => toggleClientAutoRenew(sub.id)}
                                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                                    sub.autoRenew ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}
                                >
                                  {sub.autoRenew ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                                  <span>{sub.autoRenew ? 'Auto-Renew ON' : 'OFF'}</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => showNotification(`Re-activation request submitted for ${sub.plan}`)}
                                  className="px-4 py-2 text-xs bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow"
                                >
                                  Re-Activate
                                </button>
                              )}
                            </div>
                          </div>

                          {sub.status === 'Active' && sub.usage && (
                            <div className="pt-2 border-t border-slate-800 space-y-1.5">
                              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                                <span>Monthly Resource Quota</span>
                                <span className="font-bold text-white">{sub.usage}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${sub.usage > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`} 
                                  style={{ width: `${sub.usage}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </main>
          </div>

          {/* MODAL: CLIENT REQUEST NEW SUBSCRIPTION */}
          {isClientReqModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" /> Request New Subscription
                  </h3>
                  <button onClick={() => setIsClientReqModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleClientSubmitRequest} className="space-y-4">
                  <div className="flex items-center justify-center bg-slate-950 p-1 rounded-2xl text-xs font-bold border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setReqBillingCycle('Monthly')}
                      className={`flex-1 py-2 rounded-xl transition ${reqBillingCycle === 'Monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Monthly Billing
                    </button>
                    <button
                      type="button"
                      onClick={() => setReqBillingCycle('Yearly')}
                      className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1 ${reqBillingCycle === 'Yearly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      <span>Yearly Billing</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded-full font-black border border-emerald-500/30">SAVE 20%</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">Select Offering</label>
                    <select 
                      onChange={(e) => {
                        const selected = products.find(p => p.id === e.target.value);
                        if (selected) setSelectedReqPlan(selected);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-white">{selectedReqPlan.name}</p>
                    <p className="text-slate-400">{selectedReqPlan.description}</p>
                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-800 mt-2">
                      <span className="text-slate-400">Calculated Charge:</span>
                      <span className="text-lg font-black text-indigo-400">
                        ₹{reqBillingCycle === 'Yearly' 
                          ? Math.round(selectedReqPlan.basePrice * 12 * 0.8).toLocaleString() 
                          : selectedReqPlan.basePrice.toLocaleString()} 
                        <span className="text-xs font-normal text-slate-500"> / {reqBillingCycle}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsClientReqModalOpen(false)} className="px-4 py-2.5 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800">Cancel</button>
                    <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30">Submit Request</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: ADMIN CREATE SUBSCRIPTION */}
          {isSubModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Create New Subscription</h3>
                  <button onClick={() => setIsSubModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddSubscription} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      value={newSub.customer}
                      onChange={(e) => setNewSub({ ...newSub, customer: e.target.value })}
                      placeholder="e.g. Acme Corp" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={newSub.email}
                      onChange={(e) => setNewSub({ ...newSub, email: e.target.value })}
                      placeholder="billing@acme.com" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">Select Plan</label>
                    <select 
                      value={newSub.plan}
                      onChange={(e) => setNewSub({ ...newSub, plan: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {products.map(p => <option key={p.id} value={p.name}>{p.name} - ₹{p.basePrice}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsSubModalOpen(false)} className="px-4 py-2.5 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800">Cancel</button>
                    <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30">Create Draft</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: RECORD PAYMENT */}
          {isPayModalOpen && selectedInvoice && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Record Payment</h3>
                  <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-slate-400">Confirm payment receipt for <span className="font-bold text-white">{selectedInvoice.id}</span> ({selectedInvoice.customer}) of <span className="font-bold text-emerald-400">₹{selectedInvoice.amount.toLocaleString()}</span>.</p>
                <form onSubmit={handleRecordPayment} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">Payment Method</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                      <option value="UPI">UPI Transfer</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="Bank">Bank Wire Transfer</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsPayModalOpen(false)} className="px-4 py-2.5 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800">Cancel</button>
                    <button type="submit" className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/30">Confirm Payment</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}