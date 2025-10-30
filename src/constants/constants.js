import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboard,
    faBriefcase,
    faBook,
    faUserTie,
    faIdCardClip,
    faIdCard,
    faIdBadge,
    faAddressCard,
    faBuilding,
    faSchool,
    faUsersLine,
    faStar,
    faRuler,
    faChartLine,
    faGraduationCap,
    faFolder,
    faFileAlt,
    faDesktop,
    faMoneyBill,
    faChartBar
} from "@fortawesome/free-solid-svg-icons";
import pms1 from "../assets/pms1.jpg";
import pms2 from "../assets/pms2.jpg";
import pms3 from "../assets/pms3.jpg";
import tms1 from "../assets/tms1.jpg";
import tms2 from "../assets/tms2.jpg";
import tms3 from "../assets/tms3.jpg";
import ebda from '../assets/EBDA.jpeg';
import wabys from '../assets/wabys.png';
import GOL from '../assets/Gov.png';
import wahby from '../assets/wahby_group.png';
import wabysWatomsLogo from '../assets/wabysWatomsLogo.png';
import wabysWisdomLogo from '../assets/wabysWisdomLogo.png';
import wabysWiseumLogo from '../assets/wabysWiseumLogo.png';
import wabysWisnmsLogo from '../assets/wabysWisnmsLogo.png';
import wabysWisecmLogo from '../assets/wabysWisecmLogo.png';
import wabysWishmsLogo from '../assets/wabysWishmsLogo.png';
import wabysWisfmsLogo from '../assets/wabysWisfmsLogo.png';
import wabysWiscmcmLogo from '../assets/wabysWiscmcmLogo.png';
import tech from '../assets/tech.jpg';
import hemam from '../assets/hemam.jpg';
import ismailiaManager from '../assets/ismailiaManager.jpg';
import ismailiaImg from '../assets/ismailiaImg.jpg';
import suezManager from '../assets/suezManager.jpg';
import sharabyaManager from '../assets/sharabyaManager.jpg';
import sharabyaImg from '../assets/sharabyaImg.jpg';
import sharqiaManager from '../assets/sharqiaManager.jpg';
import sharqiaImg from '../assets/sharqiaImg.jpg';
import boulaqManager from '../assets/boulaqManager.jpg';
import boulaqImg from '../assets/boulaqImg.jpg';

export const IMPORTANCE_LEVELS = ["normal", "important", "urgent"];

export const TASK_SIZES = ["small", "medium", "large"];

export const WISDOM_INTERVIEW_EN_TITLES = [
    "Planning for Teaching/Learning Process",
    "Integrating Technology into Teaching",
    "Utilized Teaching Methods",
    "Selecting and Utilizing Teaching/Learning Resources",
    "Classroom Management & Student Motivation",
    "Assessment Techniques & Feedback",
];

export const WISDOM_INTERVIEW_AR_TITLES = [
    "التخطيط لعملية التعليم/التعلم",
    "دمج التكنولوجيا في التعليم",
    "أساليب التدريس المستخدمة",
    "اختيار واستخدام مصادر التعليم",
    "إدارة الصف وتحفيز الطلاب",
    "تقنيات التقييم والتغذية الراجعة",
];

export const STATUS_OPTIONS = [
    // "0",
    "25",
    "50",
    "75",
    "finished",
    "on hold",
    "in progress",
    "past the due date",
    "submitted",
    "under review",
    "not started yet",
];

export const WISDOM_PMS_EN_LIST = {
    T: "Teacher",
    AC: "Academic Principle",
    C: "Curriculum",
    H: "HOD",
    EDU: "Edu Environment",
    EX: "Executive Manager",
    SPEC: "Specialist",
    W: "Work Enivornment",
    DO: "Daily Operations",
    CRO: "PD",
};

export const WISDOM_PMS_AR_LIST = {
    T: "المدرس",
    AC: "المدير الاكاديمي",
    C: "المناهج",
    H: "رئيس القسم",
    EDU: "البيئة التعليمية",
    EX: "المدير التنفيذي",
    SPEC: "المتخصص",
    W: "بيئة العمل",
    DO: "الأشراف المدرسي",
    CRO: "التنمية المهنية",
};

export const PMS_DISCREPTION = "This module drives organizational success by setting clear goals, tracking progress, and offering feedback. It supports data-driven decisions for talent development, performance improvement, and strategic goal achievement, boosting efficiency and effectiveness.";

export const WISDOM_PMS_ROLE_PERMISSION = {
    T: "Teacher",
    HOD: "Head of Department (HOD)",
    AC: "Academic Principle",
    EX: "Executive Manager",
    S: "Student",
    Self: "Self",
    Cl: "Teacher",
    QA: "Quality Officer",
    ML: "Line Supervisor",
    E: "Employee",
    OB: "Employee",
    AD: "ADMIN",
    OEL: "Operations Excellence Lead"
};

export const WISDOM_PMS_FORMS_LOGOS = [
    <FontAwesomeIcon icon={faUserTie} />,
    <FontAwesomeIcon icon={faBook} />,
    <FontAwesomeIcon icon={faIdCard} />,
    <FontAwesomeIcon icon={faBuilding} />,
    <FontAwesomeIcon icon={faSchool} />,
    <FontAwesomeIcon icon={faIdBadge} />,
    <FontAwesomeIcon icon={faAddressCard} />,
    <FontAwesomeIcon icon={faIdCardClip} />,
    <FontAwesomeIcon icon={faClipboard} />,
    <FontAwesomeIcon icon={faBriefcase} />,
];

export const WSIDOM_PMS_FORMS_ORDER = [0, 2, 4, 6, 5, 1, 3];

export const WISDOM_PMS_HERO_INFO = [
    {
        img: pms1,
        title: "Progress Tracking",
        description:
            "Easily monitor team and individual growth towards key objectives.",
    },
    {
        img: pms2,
        title: "Insightful Metrics",
        description:
            "Understand performance deeply with data that drives smarter decisions.",
    },
    {
        img: pms3,
        title: "Resources Optimization",
        description:
            "Maximize efficiency, Ensue optimal allocation, Reduce costs",
    },
];

export const WISDOM_LATNESS_OPTIONS = ["5", "10", "15", "20", "25", "30"];

export const WISDOM_TEST_EN_TITLES = [
    "Planning for Teaching/Learning Process",
    "Integrating Technology into Teaching",
    "Utilized Teaching Methods",
    "Selecting and Utilizing Teaching/Learning Resources",
    "Classroom Management & Student Motivation",
    "Assessment Techniques & Feedback",
];

export const WISDOM_TEST_AR_TITLES = [
    "التخطيط لعملية التعليم/التعلم",
    "دمج التكنولوجيا في التعليم",
    "أساليب التدريس المستخدمة",
    "اختيار واستخدام مصادر التعليم",
    "إدارة الصف وتحفيز الطلاب",
    "تقنيات التقييم والتغذية الراجعة",
];

export const TMS_DESCRIPTION = "This module boosts accountability and project execution through clear task assignment, deadlines, and real-time tracking. It streamlines coordination, cuts delays, and ensures timely completion, driving efficiency and project success."

export const TMS_HERO_INFO = [
    {
        img: tms1,
        title: "Productivity Boost",
        description:
            "Skyrocket your output, achieve peak performance, see results fast.",
    },
    {
        img: tms2,
        title: "Deadline Driven",
        description:
            "Conquer every deadline, ensuring timely success, stress-free now.",
    },
    {
        img: tms3,
        title: "Streamlined Workflow",
        description: "Eliminate wasted effort. Work smarter, not harder.",
    },
];

export const WATOMS_INTERVIEW_TITLES = [
    "عنوان 6",
    "عنوان 5",
    "عنوان 4",
    "عنوان 3",
    "عنوان 2",
    "عنوان 1",
];

export const WATOMS_PMS_LIST = {
    IP: "الاداء المؤسسي",
    PO: "التخطيط و التشغيل",
    W: "بيئة العمل",
    TE: "بيئة التدريب",
    QD: "الجودة و التطوير",
    DD: "الرقمنة و تخزين البيانات",
    TP: "مسار التدريب",
    TG: "البرامج التدريبية",
    TR: "اداء المتدرب",
    T: "اداء المدرب",
    CP: "المشاركة المجتمعية",
    CRO: "التنمية المهنية"
};

export const WATOMS_PMS_ROLE_PERMISSION = {
    Self: "Self",
    T: "Teacher",
    TS: "Teacher",
    TR: "Student",
    AD: "ADMIN",
    MGR: "Manager",
    OEL: "Operations Excellence Lead",
    SV: "VtcSupervisor",
    CRO: "ClassRoom Observation"
};

export const WATOMS_PMS_FORMS_LOGOS = [
    <FontAwesomeIcon icon={faUsersLine} />,
    <FontAwesomeIcon icon={faBuilding} />,
    <FontAwesomeIcon icon={faAddressCard} />,
    <FontAwesomeIcon icon={faSchool} />,
    <FontAwesomeIcon icon={faStar} />,
    <FontAwesomeIcon icon={faUserTie} />,
    <FontAwesomeIcon icon={faBook} />,
    <FontAwesomeIcon icon={faRuler} />,
    <FontAwesomeIcon icon={faIdCard} />,
    <FontAwesomeIcon icon={faIdCardClip} />,
    <FontAwesomeIcon icon={faBriefcase} />,
    <FontAwesomeIcon icon={faClipboard} />,
];

export const WATOMS_PMS_FORMS_ORDER = [4, 1, 2, 6, 8, 3, 0, 5, 9, 7];

export const WATOMS_PMS_HERO_INFO = [
    {
        img: pms1,
        title: "نظرة متكاملة",
        description:
            "لاداء الافراد و المؤسسة و الوصول للاعتماد الدولي",
    },
    {
        img: pms2,
        title: "تنسيق شامل",
        description:
            "للبيانات و تقارير الاداء من خلال شاشات احصائية دقيقة شاملة",
    },
    {
        img: pms3,
        title: "تطوير متكامل",
        description:
            "للاداء الفني و التشغيل و الاداري و المدربين و المتدربين",
    },
];

export const WATOMS_TEST_TITLES = [
    "التخطيط لعملية التعليم/التعلم",
    "دمج التكنولوجيا في التعليم",
    "أساليب التدريس المستخدمة",
    "اختيار واستخدام مصادر التعليم",
    "إدارة الصف وتحفيز الطلاب",
    "تقنيات التقييم والتغذية الراجعة",
];

export const PARTNERS = [
    { title: "وابيز للتدريب و التعليم", image: wabys, width: "w-40" },
    { title: "وزارة العمل المصرية", image: GOL, width: "w-24" },
    { title: "ابدأ لتنمية الصناعات", image: ebda, width: "w-40" },
    { title: "وهبي جروب", image: wahby, width: "w-56" },
];

export const TEACHER_LATENESS_ENGLISH_TITLES = [
    "Class",
    "Session 1",
    "Session 2",
    "Session 3",
    "Session 4",
    "Session 5",
    "Session 6",
    "Session 7",
    "Session 8",
    "Session 9",
    "Session 10"
];

export const TEACHER_LATENESS_ARABIC_TITLES = [
    "الفصل",
    "الحصة ١",
    "الحصة ٢",
    "الحصة ٣",
    "الحصة ٤",
    "الحصة ٥",
    "الحصة ٦",
    "الحصة ٧",
    "الحصة ٨",
    "الحصة ٩",
    "الحصة ١٠"
];

export const NEQATY_PERMISSION_STATUS = [
    "accepted",
    "pending",
    "denied"
]

export const INSTITUTION_CURRICULUM_RELATION = {
    4: [4, 21, 22, 23, 24, 25, 26, 27, 28, 29, 7, 30, 6, 5, 31, 9, 20, 12, 8, 32, 33],
    5: [6, 8, 4, 30, 5, 7, 34, 32, 2, 44, 50, 51],
    7: [5, 20, 9, 34, 24, 4, 7, 30, 6, 8, 37],
    8: [12, 38, 39, 30, 4, 6, 8, 40, 24, 41, 31, 9, 42, 43, 36, 5, 7, 44, 45],
    9: [6, 8, 4, 30, 35, 7, 31, 9, 36, 37],
    14: [36]
}

export const INSTITUTION_COURSE_RELATION = {
    4: [53, 4, 9, 31, 7, 20, 52],
    5: [53, 6, 8, 4, 30, 5, 7, 34, 32],
    7: [53, 5, 20, 9, 34, 24, 4, 7, 30, 6, 8, 37],
    8: [53, 12, 38, 39, 30, 4, 6, 8, 40, 24, 41, 31, 9, 42, 43, 36, 5, 7, 44, 45],
    9: [53, 6, 8, 4, 30, 35, 7, 31, 9, 36, 37]
}

export const SCHOOL_CURRICULUM_RELATION = {
    1: [1, 2, 3, 13, 14, 15, 16, 17, 18, 46, 47],
    2: [1, 2, 3, 13, 14, 15, 16, 17, 18]
}

export const ORGANIZATIONS_PASSWORD_CODE = {
    "Badr": "badr",
    "Damietta": "damietta",
    "مركز الاسماعيلية": "ismailia",
    "مركز السويس": "suez",
    "مركز الشرابية": "sharabya",
    "مركز بولاق": "boulaq",
    "مركز الشرقية": "sharqia"
}

export const ORGANIZATIONS_TYPE = [
    "School",
    "Institution"
]

export const ASSESSOR_TYPE = [
    "Employee / Teacher / Trainer",
    "Student / Trainee"
]

export const getEbdaEduSystems = (language, userOrg) => [
    {
        id: 'tms',
        title: 'TMS',
        subtitle: language ? 'Task Management System' : 'نظام إدارة المهام',
        description: language ? 'Task and development management' : 'إدارة التدريب والتطوير',
        icon: faGraduationCap,
        path: '/IEES/tms',
        color: 'from-purple-500 to-purple-600',
        available: true
    }
];

export const getWatomsSystems = (language, userOrg, userInfo) => [
    {
        id: 'pms',
        title: 'Perfo.MS',
        subtitle: language ? 'Performance Management System' : 'نظام إدارة الأداء',
        description: language ? 'Performance management and human resources' : 'إدارة الأداء والموارد البشرية',
        icon: faChartLine,
        path: '/watoms/pms',
        color: 'from-blue-500 to-blue-600',
        available: true,
        notificationStatus: false
    },
    {
        id: 'dms',
        title: 'DMS',
        subtitle: language ? 'Document Management System' : 'نظام إدارة الوثائق',
        description: language ? 'Document and file management' : 'إدارة الوثائق والملفات',
        icon: faFolder,
        path: '/watoms/dms',
        color: 'from-green-500 to-green-600',
        available: true,
        notificationStatus: false
    },
    {
        id: 'tms',
        title: 'TMS',
        subtitle: language ? 'Task Management System' : 'نظام إدارة التدريب',
        description: language ? 'Task and development management' : 'إدارة التدريب والتطوير',
        icon: faGraduationCap,
        path: '/watoms/tms',
        color: 'from-purple-500 to-purple-600',
        available: true,
        notificationStatus: true,
        notificationNumber: 3,
    },
    {
        id: 'lms',
        title: 'LMS',
        subtitle: language ? 'Learning Management System' : 'نظام إدارة التعلم',
        description: language ? 'E-learning management system' : 'نظام إدارة التعلم الإلكتروني',
        icon: faDesktop,
        path: '/lms',
        color: 'from-indigo-500 to-indigo-600',
        available: false,
        notificationStatus: false
    },
    {
        id: 'pdms',
        title: 'PDMS',
        subtitle: language ? 'Project Document Management System' : 'نظام إدارة وثائق المشاريع',
        description: language ? 'Project document management' : 'إدارة وثائق المشاريع',
        icon: faFileAlt,
        path: '/pdms',
        color: 'from-orange-500 to-orange-600',
        available: false,
        notificationStatus: false
    },
    {
        id: 'points',
        title: language ? 'Point System' : 'نظام النقاط',
        subtitle: language ? 'Points and Rewards System' : 'نظام النقاط والمكافآت',
        description: language ? 'Points management and incentives' : 'إدارة النقاط والحوافز',
        icon: faStar,
        path: '/neqaty/vtcs',
        color: 'from-yellow-500 to-yellow-600',
        available: userOrg === 3,
        notificationStatus: false
    },
    {
        id: 'finance',
        title: language ? 'Finance System' : 'نظام المالية',
        subtitle: language ? 'Financial Management System' : 'نظام إدارة المالية',
        description: language ? 'Financial and accounting management' : 'إدارة الشؤون المالية والمحاسبية',
        icon: faMoneyBill,
        path: '/finance',
        color: 'from-emerald-500 to-emerald-600',
        available: false,
        notificationStatus: false
    },
    {
        id: 'hr',
        title: 'HR System',
        subtitle: language ? 'Human Resources System' : 'نظام الموارد البشرية',
        description: language ? 'Employee affairs management' : 'إدارة شؤون الموظفين',
        icon: faUserTie,
        path: '/hr',
        color: 'from-pink-500 to-pink-600',
        available: false,
        notificationStatus: false
    },
    {
        id: 'INFA',
        title: language ? 'INFA.S' : 'INFA.S',
        subtitle: language ? 'Infrastructure Management System' : 'نظام ادارة البنية التحتية',
        description: language ? 'Efficient and effective management and monitoring of infrastructure.' : 'ادارة البنية التحتية بكفاءة و فاعلية',
        icon: faBuilding,
        path: '/watoms/dashboard',
        color: 'from-slate-500 to-slate-600',
        available: false,
        notificationStatus: false
    },
    {
        id: 'dashboards',
        title: language ? 'Dashboards' : 'لوحات التحكم',
        subtitle: language ? 'Control Panels and Statistics' : 'لوحات التحكم والإحصائيات',
        description: language ? 'Interactive management dashboards' : 'لوحات تحكم تفاعلية للإدارة',
        icon: faChartBar,
        path: userOrg === 14 || userOrg === 13 ? '/demo/dashboard' : '/watoms/dashboard',
        color: 'from-cyan-500 to-cyan-600',
        available: true,
        notificationStatus: false
    },
    {
        id: 'Professional examination',
        title: language ? 'Professional examination' : 'فحص مهني',
        subtitle: language ? 'Control Panels and Statistics' : 'لوحات التحكم والإحصائيات',
        description: language ? 'Interactive management dashboards' : 'لوحات تحكم تفاعلية للإدارة',
        icon: faChartBar,
        path: '/watoms/pe',
        color: 'from-red-500 to-red-600',
        available: userInfo?.code === 3 || userInfo?.code === 1 ? true : false,
        notificationStatus: false
    }
];

export const getWabysSystems = (language, userOrg) => [
    {
        id: 'watoms',
        title: 'Watoms',
        subtitle: 'WABYS ',
        redSubtitle: 'Auto Training Operations ',
        subtitle2: 'Management System',
        icon: wabysWisdomLogo,
        path: '/watoms',
        color: 'from-blue-500 to-blue-600',
        available: userOrg !== 1 && userOrg !== 2
    },
    {
        id: 'wisdom',
        title: 'Wisdom',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Dedactics and Operations',
        subtitle2: ' Management',
        icon: wabysWatomsLogo,
        path: '/wisdom',
        color: 'from-green-500 to-green-600',
        available: userOrg === 1 || userOrg === 2 || userOrg === 3 || userOrg === 6
    },
    {
        id: 'wiseum',
        title: 'Wiseum',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Effective University',
        subtitle2: ' Management',
        icon: wabysWiseumLogo,
        path: '',
        color: 'from-purple-500 to-purple-600',
        available: false
    },
    {
        id: 'wisnms',
        title: 'Wisnms',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Nurseries',
        subtitle2: ' Management System',
        icon: wabysWisnmsLogo,
        path: '',
        color: 'from-indigo-500 to-indigo-600',
        available: false
    },
    {
        id: 'wisecm',
        title: 'Wisecm',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Education Centers',
        subtitle2: ' Managemenet',
        icon: wabysWisecmLogo,
        path: '',
        color: 'from-orange-500 to-orange-600',
        available: false
    },
    {
        id: 'wishms',
        title: 'Wishms',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Hospital',
        subtitle2: ' Management System',
        icon: wabysWishmsLogo,
        path: '',
        color: 'from-yellow-500 to-yellow-600',
        available: false
    },
    {
        id: 'wisfms',
        title: 'Wisfms',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Factories',
        subtitle2: ' Management System',
        icon: wabysWisfmsLogo,
        path: '',
        color: 'from-emerald-500 to-emerald-600',
        available: false
    },
    {
        id: 'wiscmcm',
        title: 'Wiscmcm',
        subtitle: 'WABYS Integrated Systems for ',
        redSubtitle: 'Car Maintenance Centers',
        subtitle2: ' Management System',
        icon: wabysWiscmcmLogo,
        path: '',
        color: 'from-pink-500 to-pink-600',
        available: false
    },
    {
        id: 'comingSoon1',
        title: 'Coming Soon',
        subtitle: '',
        redSubtitle: '',
        subtitle2: '',
        icon: '',
        path: '',
        color: 'from-cyan-500 to-cyan-600',
        available: false
    }
    ,
    {
        id: 'comingSoon2',
        title: 'Coming Soon',
        subtitle: '',
        redSubtitle: '',
        subtitle2: '',
        icon: '',
        path: '',
        color: 'from-yellow-400 to-yellow-500',
        available: false
    }
];

// Quick Stats Data
export const dummyQuickStats = (language) => [
    {
        icon: faChartLine,
        label: language ? "Completed Tasks" : "المهام المكتملة",
        value: "24",
        color: "from-blue-500 to-blue-600",
        change: "+12%"
    },
    {
        icon: faFolder,
        label: language ? "Documents" : "الوثائق",
        value: "156",
        color: "from-green-500 to-green-600",
        change: "+8%"
    },
    {
        icon: faGraduationCap,
        label: language ? "Training Sessions" : "جلسات التدريب",
        value: "8",
        color: "from-purple-500 to-purple-600",
        change: "+15%"
    }
];

// Recent Activity Data
export const dummyRecentActivity = (language) => [
    {
        icon: faChartLine,
        title: language ? "Performance report completed" : "تم إكمال تقرير الأداء الشهري",
        time: language ? "2 hours ago" : "منذ ساعتين",
        color: "bg-blue-500"
    },
    {
        icon: faFolder,
        title: language ? "New document uploaded to DMS" : "تم رفع وثيقة جديدة في DMS",
        time: language ? "4 hours ago" : "منذ 4 ساعات",
        color: "bg-green-500"
    },
    {
        icon: faGraduationCap,
        title: language ? "Training session attendance recorded" : "تم تسجيل حضور في جلسة تدريبية",
        time: language ? "1 day ago" : "منذ يوم واحد",
        color: "bg-purple-500"
    }
];

export const ORGANIZATION_OTHER_LANGUAGE = {
    "Badr": "بدر",
    "Damietta": "دمياط",
    "مركز الاسماعيلية": "ismailia",
    "مركز السويس": "suez",
    "مركز الشرابية": "sharabya",
    "مركز بولاق": "boulaq",
    "مركز الشرقية": "sharqia",
    "Ebda (Test)": "ابدا (اختبار)"
}

export const WATOMS_PROJECTS = [
    {
        code: "EIVOTS",
        english_title: "Vocational training center",
        arabic_title: "تطوير و تشغيل مراكز التدريب المهني",
        image: GOL,
        projects: [
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: hemam
            },
            {
                title: "test",
                image: tech
            },
        ]
    },
    {
        code: "FFGD",
        english_title: "Vocational training center",
        arabic_title: "تطوير و تشغيل مراكز التدريب المهني",
        image: GOL,
        projects: [
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
        ]
    },
    {
        code: "KAJG",
        english_title: "Vocational training center",
        arabic_title: "تطوير و تشغيل مراكز التدريب المهني",
        image: GOL,
        projects: [
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
        ]
    },
    {
        code: "DESFG",
        english_title: "Vocational training center",
        arabic_title: "تطوير و تشغيل مراكز التدريب المهني",
        image: GOL,
        projects: [
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
        ]
    },
    {
        code: "SDGAS",
        english_title: "Vocational training center",
        arabic_title: "تطوير و تشغيل مراكز التدريب المهني",
        image: GOL,
        projects: [
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
        ]
    },
    {
        code: "SDFS",
        english_title: "Vocational training center",
        arabic_title: "تطوير و تشغيل مراكز التدريب المهني",
        image: GOL,
        projects: [
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
            {
                title: "test",
                image: tech
            },
        ]
    }
]

export const TRAINEES_CERTIFICATES = [
    "حاصل علي شهادة الاعدادية",
    "حاصل علي شهادة الثانوية",
    "طالب جامعي",
    "حاصل علي شهادة دبلوم",
    "حاصل علي شهادة جامعية"
]

export const KNOWN_US = [
    "فيسبوك",
    "انستاجرام",
    "تيك توك",
    "لينكدان",
    "صفحات وزارة العمل",
    "صفحة وزارة التربية و التعليم",
    "صديق",
    "Others",
]

// export const ALL_MONTHS = [ {id: 1, name: 'يناير'}, {id: 2, name: 'فبراير'}, {id: 3, name: 'مارس'}, {id: 4, name: 'ابريل'}, {id: 5, name: 'مايو'}, {id: 6, name: 'يونيو'}, {id: 7, name: 'يوليو'}, {id: 8, name: 'اغسطس'}, {id: 9, name: 'سبتمبر'}, {id: 10, name: 'اكتوبر'}, {id: 11, name: 'نوفمبر'}, {id: 12, name: 'ديسمبر'}]
export const ALL_MONTHS = [{ id: 4, name: 'ابريل' }, { id: 5, name: 'مايو' }, { id: 6, name: 'يونيو' }, { id: 7, name: 'يوليو' }, { id: 8, name: 'اغسطس' }, { id: 9, name: 'سبتمبر' }, { id: 10, name: 'اكتوبر' }, { id: 11, name: 'نوفمبر' }, { id: 12, name: 'ديسمبر' }]

export const ORG_MANAGER_IMG = [
    {
        id: 4,
        img: ismailiaManager,
        org: ismailiaImg
    },
    {
        id: 5,
        img: suezManager,
        org: ""
    },
    {
        id: 7,
        img: sharabyaManager,
        org: sharabyaImg
    },
    {
        id: 8,
        img: boulaqManager,
        org: boulaqImg
    },
    {
        id: 9,
        img: sharqiaManager,
        org: sharqiaImg
    },
]

export const INSTITUTION_NO_CURRICULUMS = {
    4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    9: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

export const SCHOOL_NO_CURRICULUMS = {
    1: [1],
    2: [1, 2],
}

export const DEMO_NO_CURRICULUMS = {
    14: [1]
}

export const WATOMS_SUB_SUB_DATA_COLOR = [
    "#e85006",
    "#3b82f6",
    "#cc87f6",
    "#1418a8",
    "#ae1ff0",
    "#dc3f06",
    "#479124",
]

export const WATOMS_UNPREPARED_DATA = {
    "All": {
        workShops: 59,
        labs: 6,
        employees: 39,
        trainers: 18,
        supervisors: 10,
        admins: 6,
    },
    4: {
        workShops: 18,
        labs: 2,
        employees: 12,
        trainers: 3,
        supervisors: 7,
        admins: 1,
    },
    5: {
        workShops: 7,
        labs: 1,
        employees: 5,
        trainers: 1,
        supervisors: 2,
        admins: 1,
    },
    7: {
        workShops: 9,
        labs: 1,
        employees: 8,
        trainers: 2,
        supervisors: 1,
        admins: 4,
    },
    8: {
        workShops: 17,
        labs: 1,
        employees: 8,
        trainers: 7,
        supervisors: 0,
        admins: 0,
    },
    9: {
        workShops: 8,
        labs: 1,
        employees: 6,
        trainers: 5,
        supervisors: 0,
        admins: 0,
    },
}

export const WISDOM_UNPREPARED_DATA = {
    "All": {
        workShops: 0,
        labs: 0,
        classes: 0,
        employees: 49,
        teachers: 24,
        students: 306,
        admins: 25,
    },
    1: {
        workShops: 0,
        labs: 0,
        classes: 0,
        employees: 26,
        teachers: 14,
        students: 161,
        admins: 12,
    },
    2: {
        workShops: 0,
        labs: 0,
        classes: 0,
        employees: 23,
        teachers: 10,
        students: 145,
        admins: 13,
    },
}

export const WATOMS_MODERN_COLORS = [
    'linear-gradient(90deg, #3fd8ff 0%, #0072ff 100%)',
    'linear-gradient(90deg, #ffb6ec 0%, #ff3c8e 100%)',
    'linear-gradient(90deg, #ffb347 0%, #ff7c00 100%)',
    'linear-gradient(90deg, #bdbdbd 0%, #757575 100%)',
];

export const WATOMS_MODERN_COLORS_TW = [
    'bg-gradient-to-r from-[#3fd8ff] to-[#0072ff]',
    'bg-gradient-to-r from-[#ffb6ec] to-[#ff3c8e]',
    'bg-gradient-to-r from-[#ffb347] to-[#ff7c00]',
    'bg-gradient-to-r from-[#bdbdbd] to-[#757575]',
    'bg-gradient-to-r from-blue-400 to-blue-600',
    'bg-gradient-to-r from-red-400 to-red-600',
];


export const NUMBER_TO_ARABIC_MONTHS = {
    1: 'يناير',
    2: 'فبراير',
    3: 'مارس',
    4: 'ابريل',
    5: 'مايو',
    6: 'يونيو',
    7: 'يوليو',
    8: 'اغسطس',
    9: 'سبتمبر',
    10: 'اكتوبر',
    11: 'نوفمبر',
    12: 'ديسمبر'
}

export const MONTHS_ARABIC = [
    { monthNumber: 1, month: "يناير" },
    { monthNumber: 2, month: "فبراير" },
    { monthNumber: 3, month: "مارس" },
    { monthNumber: 4, month: "أبريل" },
    { monthNumber: 5, month: "مايو" },
    { monthNumber: 6, month: "يونيو" },
    { monthNumber: 7, month: "يوليو" },
    { monthNumber: 8, month: "أغسطس" },
    { monthNumber: 9, month: "سبتمبر" },
    { monthNumber: 10, month: "أكتوبر" },
    { monthNumber: 11, month: "نوفمبر" },
    { monthNumber: 12, month: "ديسمبر" },
];

export const CRO_RECOMMENDATIONS = [
    {
        id: "اولا:",
        field: "​التخطيط للتدريس القائم على الجدارات",
    },
    {
        id: "ثانيا:",
        field: "​إدارة الصف الدراسي وتحفيز مشاركة المتعلمين",
    },
    {
        id: "ثالثا:",
        field: "​اختيار وتصميم مصادر التعلم",
    },
    {
        id: "رابعا:",
        field: "​دمج وتوظيف التكنولوجيا في التعليم",
    },
    {
        id: "خامسا:",
        field: "​استخدام استراتيجيات التدريس",
    },
    {
        id: "سادسا:",
        field: "​التقييم والتقويم",
    },
]

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const COUNTRYS = [
    "المملكة العربية السعودية",
    "الامارات العربية المتحدة"
]