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
    EX: "Executive Principle",
    SPEC: "Specialist",
    W: "Work Enivornment",
    DO: "Daily Operations",
    PD: "PD",
};

export const WISDOM_PMS_AR_LIST = {
    T: "مدرس",
    AC: "المدير الاكاديمي",
    C: "المناهج",
    H: "مدير القطاع",
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
    TR: "Student",
    AD: "ADMIN",
    MGR: "Manager",
    OEL: "Operations Excellence Lead"
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