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
import dms1 from "../assets/dms1.jpg";
import dms2 from "../assets/dms2.jpg";
import dms3 from "../assets/dms3.jpg";
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

export const IMPORTANCE_LEVELS = ["normal", "important", "urgent"];

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
    PD: "PD",
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
    PD: "التنمية المهنية",
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

export const DMS_DESCRIPTION = "This module ensures operational efficiency and compliance by providing a secure, organized repository for critical documents. It streamlines access, version control, collaboration, and reduces risks from lost or mismanaged information."

export const DMS_HERO_INFO = [
    {
        img: dms1,
        title: "Effortless Access",
        description:
            "Find and utilize crucial information right at your fingertips.",
    },
    {
        img: dms2,
        title: "Information Hub",
        description:
            "Your secure, centralized source for all essential knowledge and data.",
    },
    {
        img: dms3,
        title: "Centralized Control",
        description: "Manage all documents and data with ease and security.",
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
    CP: "المشاركة المجتمعية"
};

export const WATOMS_PMS_ROLE_PERMISSION = {
    Self: "Self",
    T: "Teacher",
    TS: "Teacher",
    TR: "Student",
    AD: "ADMIN",
    MGR: "Manager",
    OEL: "Operations Excellence Lead",
    SV: "VtcSupervisor"
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
    "عنوان 6",
    "عنوان 5",
    "عنوان 4",
    "عنوان 3",
    "عنوان 2",
    "عنوان 1",
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
    5: [6, 8, 4, 30, 5, 7, 34, 32],
    7: [5, 20, 9, 34, 24, 4, 7, 30, 6, 8, 37],
    8: [12, 38, 39, 30, 4, 6, 8, 40, 24, 41, 31, 9, 42, 43, 36, 5, 7, 44, 45],
    9: [6, 8, 4, 30, 35, 7, 31, 9, 36, 37]
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

export const getWatomsSystems = (language) => [
    {
        id: 'pms',
        title: 'PMS',
        subtitle: language ? 'Performance Management System' : 'نظام إدارة الأداء',
        description: language ? 'Performance management and human resources' : 'إدارة الأداء والموارد البشرية',
        icon: faChartLine,
        path: '/watoms/pms',
        color: 'from-blue-500 to-blue-600',
        available: true
    },
    {
        id: 'dms',
        title: 'DMS',
        subtitle: language ? 'Document Management System' : 'نظام إدارة الوثائق',
        description: language ? 'Document and file management' : 'إدارة الوثائق والملفات',
        icon: faFolder,
        path: '/watoms/dms',
        color: 'from-green-500 to-green-600',
        available: true
    },
    {
        id: 'tms',
        title: 'TMS',
        subtitle: language ? 'Training Management System' : 'نظام إدارة التدريب',
        description: language ? 'Training and development management' : 'إدارة التدريب والتطوير',
        icon: faGraduationCap,
        path: '/watoms/tms',
        color: 'from-purple-500 to-purple-600',
        available: true
    },
    {
        id: 'lms',
        title: 'LMS',
        subtitle: language ? 'Learning Management System' : 'نظام إدارة التعلم',
        description: language ? 'E-learning management system' : 'نظام إدارة التعلم الإلكتروني',
        icon: faDesktop,
        path: '/lms',
        color: 'from-indigo-500 to-indigo-600',
        available: false
    },
    {
        id: 'pdms',
        title: 'PDMS',
        subtitle: language ? 'Project Document Management System' : 'نظام إدارة وثائق المشاريع',
        description: language ? 'Project document management' : 'إدارة وثائق المشاريع',
        icon: faFileAlt,
        path: '/pdms',
        color: 'from-orange-500 to-orange-600',
        available: false
    },
    {
        id: 'points',
        title: language ? 'Point System' : 'نظام النقاط',
        subtitle: language ? 'Points and Rewards System' : 'نظام النقاط والمكافآت',
        description: language ? 'Points management and incentives' : 'إدارة النقاط والحوافز',
        icon: faStar,
        path: '/points',
        color: 'from-yellow-500 to-yellow-600',
        available: false
    },
    {
        id: 'finance',
        title: language ? 'Finance System' : 'نظام المالية',
        subtitle: language ? 'Financial Management System' : 'نظام إدارة المالية',
        description: language ? 'Financial and accounting management' : 'إدارة الشؤون المالية والمحاسبية',
        icon: faMoneyBill,
        path: '/finance',
        color: 'from-emerald-500 to-emerald-600',
        available: false
    },
    {
        id: 'hr',
        title: 'HR System',
        subtitle: language ? 'Human Resources System' : 'نظام الموارد البشرية',
        description: language ? 'Employee affairs management' : 'إدارة شؤون الموظفين',
        icon: faUserTie,
        path: '/hr',
        color: 'from-pink-500 to-pink-600',
        available: false
    },
    {
        id: 'dashboards',
        title: language ? 'Dashboards' : 'لوحات التحكم',
        subtitle: language ? 'Control Panels and Statistics' : 'لوحات التحكم والإحصائيات',
        description: language ? 'Interactive management dashboards' : 'لوحات تحكم تفاعلية للإدارة',
        icon: faChartBar,
        path: '/watoms/dashboard',
        color: 'from-cyan-500 to-cyan-600',
        available: true
    }
];

export const getWabysSystems = (language, userOrg) => [
    {
        id: 'watoms',
        title: 'Watoms',
        subtitle: 'WABYS ',
        redSubtitle: 'Auto Training Operations ',
        subtitle2: 'Management System',
        description: '',
        icon: wabysWatomsLogo,
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
        description: '',
        icon: wabysWisdomLogo,
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
        description: '',
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
        description: '',
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
        description: '',
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
        description: '',
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
        description: '',
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
        description: '',
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
        description: '',
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
        description: '',
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