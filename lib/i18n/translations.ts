export const LANGUAGES = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];

type TranslationStrings = {
    // Nav
    nav_dashboard: string;
    nav_companies: string;
    nav_templates: string;
    nav_sign_in: string;
    nav_sign_out: string;

    // Landing
    landing_headline_1: string;
    landing_headline_2: string;
    landing_subtitle: string;
    landing_cta: string;
    landing_try_guest: string;
    landing_free_badge: string;
    landing_templates_title: string;
    landing_templates_subtitle: string;

    // Features
    feature_designer_title: string;
    feature_designer_desc: string;
    feature_import_title: string;
    feature_import_desc: string;
    feature_fields_title: string;
    feature_fields_desc: string;
    feature_export_title: string;
    feature_export_desc: string;

    // Login
    login_title: string;
    login_subtitle: string;
    login_google: string;
    login_or: string;
    login_guest: string;
    login_guest_note: string;
    login_quote: string;

    // Dashboard
    dash_title: string;
    dash_welcome: string;
    dash_companies: string;
    dash_templates: string;
    dash_people: string;
    dash_quick_actions: string;
    dash_add_company: string;
    dash_add_company_desc: string;
    dash_create_template: string;
    dash_create_template_desc: string;
    dash_browse_templates: string;
    dash_browse_templates_desc: string;
    dash_recent_companies: string;
    dash_view_all: string;

    // Companies
    companies_title: string;
    companies_subtitle: string;
    companies_empty: string;
    companies_empty_sub: string;
    companies_add: string;
    companies_sample: string;
    companies_edit: string;
    companies_delete: string;
    companies_delete_confirm: string;

    // People
    people_title: string;
    people_empty: string;
    people_add: string;
    people_edit: string;
    people_delete: string;
    people_delete_confirm: string;
    people_generate: string;
    people_import: string;

    // Templates
    templates_title: string;
    templates_subtitle: string;
    templates_new: string;
    templates_your: string;
    templates_starter: string;
    templates_starter_sub: string;
    templates_use: string;
    templates_empty: string;

    // Designer
    designer_create: string;
    designer_edit: string;
    designer_save: string;
    designer_update: string;
    designer_cancel: string;
    designer_name: string;
    designer_landscape: string;
    designer_portrait: string;
    designer_square: string;
    designer_grid: string;
    designer_background: string;

    // Modal common
    modal_save: string;
    modal_cancel: string;
    modal_delete: string;
    modal_close: string;

    // Import
    import_title: string;
    import_upload: string;
    import_paste: string;
    import_paste_placeholder: string;
    import_sample: string;
    import_format: string;
    import_map: string;
    import_preview: string;
    import_skip: string;
    import_ready: string;
    import_button: string;
    import_done: string;
    import_success: string;
    import_back: string;

    // Generate
    generate_title: string;
    generate_subtitle: string;
    generate_select_all: string;
    generate_button: string;
    generate_generating: string;

    // Guest
    guest_banner: string;
    guest_banner_link: string;

    // Custom fields
    custom_fields_title: string;
    custom_fields_desc: string;
    custom_fields_add: string;
    custom_fields_placeholder: string;

    // Company form
    form_company_name: string;
    form_domain: string;
    form_website: string;
    form_logo: string;

    // Person form
    form_first_name: string;
    form_last_name: string;
    form_job_title: string;
    form_email: string;
    form_phone: string;
    form_template: string;
    form_photo: string;
    form_no_templates: string;
};

const en: TranslationStrings = {
    nav_dashboard: "Dashboard",
    nav_companies: "Companies",
    nav_templates: "Templates",
    nav_sign_in: "Sign in",
    nav_sign_out: "Sign out",
    landing_headline_1: "Beautiful business cards,",
    landing_headline_2: "designed in minutes",
    landing_subtitle: "Create stunning digital business cards for your entire team. Drag-and-drop designer, instant generation, and one-click contact sharing.",
    landing_cta: "Get Started Free",
    landing_try_guest: "Try without account",
    landing_free_badge: "Free to use — no credit card required",
    landing_templates_title: "Starter Templates Included",
    landing_templates_subtitle: "Choose from professionally designed templates or create your own from scratch.",
    feature_designer_title: "Drag & Drop Designer",
    feature_designer_desc: "Position text, images, shapes, and QR codes on a visual canvas with snapping and gradients.",
    feature_import_title: "Bulk Import",
    feature_import_desc: "Import entire teams via CSV upload or paste from a spreadsheet. Auto-maps columns to fields.",
    feature_fields_title: "Custom Fields",
    feature_fields_desc: "Add department, LinkedIn, office, or any custom field per company. Use them in templates and CSV imports.",
    feature_export_title: "Instant Export",
    feature_export_desc: "Generate self-contained HTML cards with embedded images, vCard downloads, and QR codes.",
    login_title: "Sign in to your account",
    login_subtitle: "Start designing professional business cards in minutes.",
    login_google: "Continue with Google",
    login_or: "or",
    login_guest: "Try without an account",
    login_guest_note: "No account needed to try. Your guest data stays in your browser.",
    login_quote: "Design once, generate for everyone. The fastest way to create professional business cards for your entire team.",
    dash_title: "Dashboard",
    dash_welcome: "Welcome back. Here's an overview of your workspace.",
    dash_companies: "Companies",
    dash_templates: "Templates",
    dash_people: "People",
    dash_quick_actions: "Quick Actions",
    dash_add_company: "Add Company",
    dash_add_company_desc: "Create a new company with logo and details",
    dash_create_template: "Create Template",
    dash_create_template_desc: "Design a new business card layout",
    dash_browse_templates: "Browse Templates",
    dash_browse_templates_desc: "View and edit your saved templates",
    dash_recent_companies: "Recent Companies",
    dash_view_all: "View all",
    companies_title: "Companies",
    companies_subtitle: "Manage your companies and their teams.",
    companies_empty: "No companies yet",
    companies_empty_sub: "Add a company to start creating business cards.",
    companies_add: "+ Add Company",
    companies_sample: "Sample",
    companies_edit: "Edit",
    companies_delete: "Delete Company",
    companies_delete_confirm: "Are you sure you want to delete \"{name}\" and all its people? This cannot be undone.",
    people_title: "People",
    people_empty: "No people added yet.",
    people_add: "+ Add Person",
    people_edit: "Edit",
    people_delete: "Delete",
    people_delete_confirm: "Are you sure you want to delete {name}? This cannot be undone.",
    people_generate: "Generate Cards",
    people_import: "Import CSV",
    templates_title: "Templates",
    templates_subtitle: "Design and manage your business card templates.",
    templates_new: "+ New Template",
    templates_your: "Your Templates",
    templates_starter: "Starter Templates",
    templates_starter_sub: "Use these as a starting point — they'll be copied so you can customize them.",
    templates_use: "Use this template",
    templates_empty: "No templates yet. Create one to get started.",
    designer_create: "Create Template",
    designer_edit: "Edit Template",
    designer_save: "Save",
    designer_update: "Update",
    designer_cancel: "Cancel",
    designer_name: "Template name",
    designer_landscape: "Landscape",
    designer_portrait: "Portrait",
    designer_square: "Square",
    designer_grid: "Grid",
    designer_background: "Background",
    modal_save: "Save",
    modal_cancel: "Cancel",
    modal_delete: "Delete",
    modal_close: "Close",
    import_title: "Bulk Import People",
    import_upload: "Upload CSV file",
    import_paste: "Paste from spreadsheet",
    import_paste_placeholder: "Copy rows from Excel or Google Sheets and paste here (include headers)",
    import_sample: "Download sample CSV",
    import_format: "Expected format",
    import_map: "Map columns",
    import_preview: "Preview",
    import_skip: "-- Skip this column --",
    import_ready: "Ready to import",
    import_button: "Import",
    import_done: "Done",
    import_success: "Import Complete",
    import_back: "Back",
    generate_title: "Generate Cards",
    generate_subtitle: "Select the people you want to generate business cards for.",
    generate_select_all: "Select all",
    generate_button: "Generate",
    generate_generating: "Generating...",
    guest_banner: "You're using CardGen as a guest. Your data is stored locally and will be lost if you clear your browser data.",
    guest_banner_link: "Sign in to save permanently",
    custom_fields_title: "Custom Fields",
    custom_fields_desc: "Define extra fields for people in this company (e.g. Department, LinkedIn, Office).",
    custom_fields_add: "Add",
    custom_fields_placeholder: "Field name (e.g. Department)",
    form_company_name: "Company Name",
    form_domain: "Domain",
    form_website: "Website",
    form_logo: "Logo",
    form_first_name: "First Name",
    form_last_name: "Last Name",
    form_job_title: "Job Title",
    form_email: "Email",
    form_phone: "Phone",
    form_template: "Template",
    form_photo: "Photo",
    form_no_templates: "No templates available. Create one first.",
};

const de: TranslationStrings = {
    ...en,
    nav_dashboard: "Übersicht",
    nav_companies: "Unternehmen",
    nav_templates: "Vorlagen",
    nav_sign_in: "Anmelden",
    nav_sign_out: "Abmelden",
    landing_headline_1: "Professionelle Visitenkarten,",
    landing_headline_2: "in Minuten gestaltet",
    landing_subtitle: "Erstellen Sie digitale Visitenkarten für Ihr gesamtes Team. Drag-and-Drop-Designer, sofortige Generierung und Kontaktfreigabe per Klick.",
    landing_cta: "Kostenlos starten",
    landing_try_guest: "Ohne Konto testen",
    landing_free_badge: "Kostenlos nutzbar — keine Kreditkarte nötig",
    landing_templates_title: "Starter-Vorlagen inklusive",
    landing_templates_subtitle: "Wählen Sie aus professionell gestalteten Vorlagen oder erstellen Sie Ihre eigenen.",
    feature_designer_title: "Drag & Drop Designer",
    feature_designer_desc: "Platzieren Sie Text, Bilder, Formen und QR-Codes frei auf einer visuellen Leinwand.",
    feature_import_title: "Massenimport",
    feature_import_desc: "Importieren Sie Teams per CSV-Upload oder Einfügen aus einer Tabelle.",
    feature_fields_title: "Eigene Felder",
    feature_fields_desc: "Fügen Sie Abteilung, LinkedIn oder beliebige Felder pro Unternehmen hinzu.",
    feature_export_title: "Sofortiger Export",
    feature_export_desc: "Generieren Sie eigenständige HTML-Karten mit eingebetteten Bildern und vCard-Downloads.",
    login_title: "Bei Ihrem Konto anmelden",
    login_subtitle: "Gestalten Sie professionelle Visitenkarten in Minuten.",
    login_google: "Mit Google fortfahren",
    login_or: "oder",
    login_guest: "Ohne Konto testen",
    login_guest_note: "Kein Konto nötig. Gastdaten bleiben in Ihrem Browser.",
    login_quote: "Einmal gestalten, für alle generieren. Der schnellste Weg zu professionellen Visitenkarten.",
    dash_title: "Übersicht",
    dash_welcome: "Willkommen zurück. Hier ist Ihre Workspace-Übersicht.",
    dash_companies: "Unternehmen",
    dash_templates: "Vorlagen",
    dash_people: "Personen",
    dash_quick_actions: "Schnellaktionen",
    dash_add_company: "Unternehmen hinzufügen",
    dash_add_company_desc: "Neues Unternehmen mit Logo und Details erstellen",
    dash_create_template: "Vorlage erstellen",
    dash_create_template_desc: "Neues Visitenkarten-Layout gestalten",
    dash_browse_templates: "Vorlagen durchsuchen",
    dash_browse_templates_desc: "Gespeicherte Vorlagen anzeigen und bearbeiten",
    dash_recent_companies: "Letzte Unternehmen",
    dash_view_all: "Alle anzeigen",
    companies_title: "Unternehmen",
    companies_subtitle: "Verwalten Sie Ihre Unternehmen und Teams.",
    companies_empty: "Noch keine Unternehmen",
    companies_empty_sub: "Fügen Sie ein Unternehmen hinzu, um Visitenkarten zu erstellen.",
    companies_add: "+ Unternehmen hinzufügen",
    companies_sample: "Beispiel",
    companies_edit: "Bearbeiten",
    companies_delete: "Unternehmen löschen",
    companies_delete_confirm: "Möchten Sie \"{name}\" und alle Personen wirklich löschen? Dies kann nicht rückgängig gemacht werden.",
    people_title: "Personen",
    people_empty: "Noch keine Personen hinzugefügt.",
    people_add: "+ Person hinzufügen",
    people_edit: "Bearbeiten",
    people_delete: "Löschen",
    people_delete_confirm: "Möchten Sie {name} wirklich löschen?",
    people_generate: "Karten generieren",
    people_import: "CSV importieren",
    templates_title: "Vorlagen",
    templates_subtitle: "Gestalten und verwalten Sie Ihre Visitenkartenvorlagen.",
    templates_new: "+ Neue Vorlage",
    templates_your: "Ihre Vorlagen",
    templates_starter: "Starter-Vorlagen",
    templates_starter_sub: "Verwenden Sie diese als Ausgangspunkt — sie werden kopiert, damit Sie sie anpassen können.",
    templates_use: "Diese Vorlage verwenden",
    templates_empty: "Noch keine Vorlagen. Erstellen Sie eine, um loszulegen.",
    designer_create: "Vorlage erstellen",
    designer_edit: "Vorlage bearbeiten",
    designer_save: "Speichern",
    designer_update: "Aktualisieren",
    designer_cancel: "Abbrechen",
    designer_name: "Vorlagenname",
    designer_landscape: "Querformat",
    designer_portrait: "Hochformat",
    designer_square: "Quadratisch",
    designer_grid: "Raster",
    designer_background: "Hintergrund",
    modal_save: "Speichern",
    modal_cancel: "Abbrechen",
    modal_delete: "Löschen",
    modal_close: "Schließen",
    import_title: "Personen massenimportieren",
    import_upload: "CSV-Datei hochladen",
    import_paste: "Aus Tabelle einfügen",
    import_paste_placeholder: "Zeilen aus Excel oder Google Sheets kopieren und hier einfügen (mit Kopfzeilen)",
    import_sample: "Beispiel-CSV herunterladen",
    import_format: "Erwartetes Format",
    import_map: "Spalten zuordnen",
    import_preview: "Vorschau",
    import_skip: "-- Diese Spalte überspringen --",
    import_ready: "Bereit zum Importieren",
    import_button: "Importieren",
    import_done: "Fertig",
    import_success: "Import abgeschlossen",
    import_back: "Zurück",
    generate_title: "Karten generieren",
    generate_subtitle: "Wählen Sie die Personen aus, für die Sie Visitenkarten generieren möchten.",
    generate_select_all: "Alle auswählen",
    generate_button: "Generieren",
    generate_generating: "Wird generiert...",
    guest_banner: "Sie nutzen CardGen als Gast. Ihre Daten werden lokal gespeichert und gehen beim Löschen der Browserdaten verloren.",
    guest_banner_link: "Anmelden zum dauerhaften Speichern",
    custom_fields_title: "Eigene Felder",
    custom_fields_desc: "Definieren Sie zusätzliche Felder für Personen in diesem Unternehmen.",
    custom_fields_add: "Hinzufügen",
    custom_fields_placeholder: "Feldname (z.B. Abteilung)",
    form_company_name: "Unternehmensname",
    form_domain: "Domain",
    form_website: "Webseite",
    form_logo: "Logo",
    form_first_name: "Vorname",
    form_last_name: "Nachname",
    form_job_title: "Berufsbezeichnung",
    form_email: "E-Mail",
    form_phone: "Telefon",
    form_template: "Vorlage",
    form_photo: "Foto",
    form_no_templates: "Keine Vorlagen verfügbar. Erstellen Sie zuerst eine.",
};

const fr: TranslationStrings = { ...en, nav_dashboard: "Tableau de bord", nav_companies: "Entreprises", nav_templates: "Modèles", nav_sign_in: "Se connecter", nav_sign_out: "Se déconnecter", landing_headline_1: "Des cartes de visite élégantes,", landing_headline_2: "créées en minutes", landing_subtitle: "Créez des cartes de visite numériques pour toute votre équipe. Éditeur glisser-déposer, génération instantanée et partage de contacts en un clic.", landing_cta: "Commencer gratuitement", landing_try_guest: "Essayer sans compte", companies_title: "Entreprises", companies_subtitle: "Gérez vos entreprises et leurs équipes.", companies_add: "+ Ajouter une entreprise", people_title: "Personnes", people_add: "+ Ajouter une personne", people_generate: "Générer des cartes", people_import: "Importer CSV", templates_title: "Modèles", templates_new: "+ Nouveau modèle", templates_use: "Utiliser ce modèle", form_company_name: "Nom de l'entreprise", form_first_name: "Prénom", form_last_name: "Nom", form_job_title: "Titre du poste", form_email: "E-mail", form_phone: "Téléphone", modal_save: "Enregistrer", modal_cancel: "Annuler", modal_delete: "Supprimer" };
const es: TranslationStrings = { ...en, nav_dashboard: "Panel", nav_companies: "Empresas", nav_templates: "Plantillas", nav_sign_in: "Iniciar sesión", nav_sign_out: "Cerrar sesión", landing_headline_1: "Tarjetas de visita profesionales,", landing_headline_2: "diseñadas en minutos", landing_cta: "Empezar gratis", landing_try_guest: "Probar sin cuenta", companies_title: "Empresas", companies_add: "+ Añadir empresa", people_title: "Personas", people_add: "+ Añadir persona", people_generate: "Generar tarjetas", templates_title: "Plantillas", templates_new: "+ Nueva plantilla", templates_use: "Usar esta plantilla", form_company_name: "Nombre de la empresa", form_first_name: "Nombre", form_last_name: "Apellido", modal_save: "Guardar", modal_cancel: "Cancelar", modal_delete: "Eliminar" };
const pt: TranslationStrings = { ...en, nav_dashboard: "Painel", nav_companies: "Empresas", nav_templates: "Modelos", nav_sign_in: "Entrar", nav_sign_out: "Sair", landing_headline_1: "Cartões de visita profissionais,", landing_headline_2: "criados em minutos", landing_cta: "Começar grátis", landing_try_guest: "Testar sem conta", companies_title: "Empresas", companies_add: "+ Adicionar empresa", people_title: "Pessoas", people_add: "+ Adicionar pessoa", people_generate: "Gerar cartões", templates_title: "Modelos", templates_new: "+ Novo modelo", templates_use: "Usar este modelo", form_company_name: "Nome da empresa", form_first_name: "Nome", form_last_name: "Sobrenome", modal_save: "Salvar", modal_cancel: "Cancelar", modal_delete: "Excluir" };
const it: TranslationStrings = { ...en, nav_dashboard: "Pannello", nav_companies: "Aziende", nav_templates: "Modelli", nav_sign_in: "Accedi", nav_sign_out: "Esci", landing_headline_1: "Biglietti da visita professionali,", landing_headline_2: "progettati in pochi minuti", landing_cta: "Inizia gratis", landing_try_guest: "Prova senza account", companies_title: "Aziende", companies_add: "+ Aggiungi azienda", people_title: "Persone", people_add: "+ Aggiungi persona", people_generate: "Genera biglietti", templates_title: "Modelli", templates_new: "+ Nuovo modello", templates_use: "Usa questo modello", form_company_name: "Nome azienda", form_first_name: "Nome", form_last_name: "Cognome", modal_save: "Salva", modal_cancel: "Annulla", modal_delete: "Elimina" };
const nl: TranslationStrings = { ...en, nav_dashboard: "Dashboard", nav_companies: "Bedrijven", nav_templates: "Sjablonen", nav_sign_in: "Inloggen", nav_sign_out: "Uitloggen", landing_headline_1: "Professionele visitekaartjes,", landing_headline_2: "ontworpen in minuten", landing_cta: "Gratis beginnen", landing_try_guest: "Probeer zonder account", companies_title: "Bedrijven", companies_add: "+ Bedrijf toevoegen", people_title: "Personen", people_add: "+ Persoon toevoegen", people_generate: "Kaarten genereren", templates_title: "Sjablonen", templates_new: "+ Nieuw sjabloon", templates_use: "Dit sjabloon gebruiken", form_company_name: "Bedrijfsnaam", form_first_name: "Voornaam", form_last_name: "Achternaam", modal_save: "Opslaan", modal_cancel: "Annuleren", modal_delete: "Verwijderen" };
const ja: TranslationStrings = { ...en, nav_dashboard: "ダッシュボード", nav_companies: "企業", nav_templates: "テンプレート", nav_sign_in: "ログイン", nav_sign_out: "ログアウト", landing_headline_1: "美しい名刺を", landing_headline_2: "数分でデザイン", landing_cta: "無料で始める", landing_try_guest: "アカウントなしで試す", companies_title: "企業", companies_add: "+ 企業を追加", people_title: "メンバー", people_add: "+ メンバーを追加", people_generate: "カード生成", templates_title: "テンプレート", templates_new: "+ 新規テンプレート", templates_use: "このテンプレートを使う", form_company_name: "企業名", form_first_name: "名", form_last_name: "姓", modal_save: "保存", modal_cancel: "キャンセル", modal_delete: "削除" };
const zh: TranslationStrings = { ...en, nav_dashboard: "仪表板", nav_companies: "公司", nav_templates: "模板", nav_sign_in: "登录", nav_sign_out: "退出", landing_headline_1: "精美名片", landing_headline_2: "几分钟内完成设计", landing_cta: "免费开始", landing_try_guest: "无需账号试用", companies_title: "公司", companies_add: "+ 添加公司", people_title: "成员", people_add: "+ 添加成员", people_generate: "生成名片", templates_title: "模板", templates_new: "+ 新建模板", templates_use: "使用此模板", form_company_name: "公司名称", form_first_name: "名", form_last_name: "姓", modal_save: "保存", modal_cancel: "取消", modal_delete: "删除" };
const ko: TranslationStrings = { ...en, nav_dashboard: "대시보드", nav_companies: "회사", nav_templates: "템플릿", nav_sign_in: "로그인", nav_sign_out: "로그아웃", landing_headline_1: "멋진 명함을", landing_headline_2: "몇 분만에 디자인", landing_cta: "무료로 시작", landing_try_guest: "계정 없이 체험", companies_title: "회사", companies_add: "+ 회사 추가", people_title: "인원", people_add: "+ 인원 추가", people_generate: "카드 생성", templates_title: "템플릿", templates_new: "+ 새 템플릿", templates_use: "이 템플릿 사용", form_company_name: "회사명", form_first_name: "이름", form_last_name: "성", modal_save: "저장", modal_cancel: "취소", modal_delete: "삭제" };

export const translations: Record<LangCode, TranslationStrings> = { en, de, fr, es, pt, it, nl, ja, zh, ko };
