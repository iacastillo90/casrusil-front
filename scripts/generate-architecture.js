const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const OUTPUT_FILE = 'SII_ERP_AI_FRONTEND_ARCHITECTURE.txt';
const BASE_DIR = path.join(__dirname, '..'); // Un nivel arriba desde /scripts/

// Carpetas a EXCLUIR del análisis
const EXCLUDED_DIRS = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'out',
    'coverage',
    '.vscode',
    '.idea',
    '.gemini',
    'scripts' // Excluir la carpeta de scripts para no analizarse a sí mismo
];

// Extensiones de archivos a procesar
const VALID_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'];

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Logger simple para consola
 */
const logger = {
    info: (msg) => console.log(msg),
    error: (msg) => console.error(`❌ ${msg}`),
    warn: (msg) => console.warn(`⚠️ ${msg}`)
};

/**
 * Determina si una ruta debe ser ignorada
 */
function shouldIgnore(filePath) {
    return EXCLUDED_DIRS.some(dir => filePath.includes(`${path.sep}${dir}${path.sep}`) || filePath.includes(`${path.sep}${dir}`));
}

/**
 * Obtiene el tipo de archivo basado en su contenido o ubicación
 */
function getFileType(filePath, code) {
    const fileName = path.basename(filePath);

    // Next.js App Router
    if (fileName === 'page.tsx' || fileName === 'page.ts') return 'Next.js Page';
    if (fileName === 'layout.tsx' || fileName === 'layout.ts') return 'Next.js Layout';
    if (fileName === 'loading.tsx') return 'Next.js Loading UI';
    if (fileName === 'error.tsx') return 'Next.js Error UI';
    if (fileName === 'route.ts') return 'API Route';
    if (fileName === 'middleware.ts') return 'Middleware';

    // Config Files
    if (fileName === 'package.json') return 'Package Config';
    if (fileName === 'tsconfig.json') return 'TypeScript Config';
    if (fileName === 'next.config.js' || fileName === 'next.config.mjs') return 'Next.js Config';
    if (fileName === 'tailwind.config.ts' || fileName === 'tailwind.config.js') return 'Tailwind Config';

    // Tests
    if (fileName.includes('.test.') || fileName.includes('.spec.')) return 'Test File';

    // State Management
    if (fileName.includes('.store.')) return 'Zustand Store';
    if (fileName.includes('context') || code.includes('createContext')) return 'React Context';

    // React/Logic
    if (fileName.startsWith('use') && code.includes('use')) return 'React Hook';
    if (code.includes('interface ') || code.includes('type ')) return 'Type Definition';
    if (code.includes('z.object')) return 'Zod Schema';

    // Component detection (heuristic)
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
        if (code.includes('return (') || code.includes('return <')) return 'React Component';
    }

    return 'Source File';
}

/**
 * Extrae imports de un archivo JS/TS
 */
function extractImports(code) {
    const importRegex = /import\s+(?:{[^}]+}|[^;]+)\s+from\s+['"]([^'"]+)['"]/g;
    const imports = new Set();
    let match;
    while ((match = importRegex.exec(code)) !== null) {
        imports.add(match[1].trim());
    }
    return Array.from(imports).sort();
}

/**
 * Extrae definiciones exportadas
 */
function extractDefinitions(code) {
    const definitions = [];
    // Regex para capturar export const/function/class/interface/type Name
    const defRegex = /export\s+(?:default\s+)?(?:const|function|class|interface|type|enum)\s+(\w+)/g;
    let match;
    while ((match = defRegex.exec(code)) !== null) {
        definitions.push(match[1]);
    }
    return definitions;
}

/**
 * Detecta issues en el código
 */
function detectIssues(code, filePath, type) {
    const issues = [];

    // General checks
    if (code.includes('console.log')) {
        issues.push('⚠️ Contiene console.log (debería eliminarse en prod)');
    }
    if (code.includes('TODO:') || code.includes('TODO ')) {
        issues.push('📝 Contiene TODOs pendientes');
    }
    if (code.includes('FIXME')) {
        issues.push('🔧 Contiene FIXMEs');
    }

    // TypeScript specific
    if (code.includes(': any') || code.includes('as any')) {
        issues.push('⚠️ Uso explícito de "any" (evitar si es posible)');
    }
    if (code.includes('@ts-ignore')) {
        issues.push('⚠️ Uso de @ts-ignore');
    }

    // React specific
    if (type.includes('Component') || type.includes('Hook')) {
        if (code.includes('useEffect(() => {') && !code.includes('useEffect(() => {') && !code.includes('}, [')) {
            // Basic check for missing dependency array (very rough)
            // Not implementing complex regex for deps array to avoid false positives
        }
    }

    if (code.split('\n').length > 300) {
        issues.push('🔴 Archivo extenso (>300 líneas)');
    }

    return issues;
}

/**
 * Procesa un archivo individual
 */
function processFile(filePath) {
    const fullPath = path.join(BASE_DIR, filePath);
    const relativePath = path.relative(BASE_DIR, fullPath);

    if (!fs.existsSync(fullPath)) return null;

    try {
        const stats = fs.statSync(fullPath);
        if (!stats.isFile()) return null;

        // Intentar leer como texto
        const code = fs.readFileSync(fullPath, 'utf-8');
        const lines = code.split('\n').length;
        const type = getFileType(relativePath, code);

        const imports = extractImports(code);
        const definitions = extractDefinitions(code);
        const issues = detectIssues(code, relativePath, type);

        let output = '\n' + '='.repeat(80) + '\n';
        output += `ARCHIVO: ${relativePath}\n`;
        output += `TIPO: ${type}\n`;
        output += `LÍNEAS: ${lines} | TAMAÑO: ${(stats.size / 1024).toFixed(2)} KB\n`;

        if (definitions.length > 0) {
            output += `EXPORTA: ${definitions.join(', ')}\n`;
        }

        if (imports.length > 0) {
            output += `\nIMPORTS (${imports.length}):\n`;
            if (imports.length > 10) {
                imports.slice(0, 10).forEach(imp => output += `  - ${imp}\n`);
                output += `  ... y ${imports.length - 10} más\n`;
            } else {
                imports.forEach(imp => output += `  - ${imp}\n`);
            }
        }

        output += `\n${'─'.repeat(80)}\n`;
        output += `CÓDIGO:\n`;
        output += `${'─'.repeat(80)}\n`;
        output += '```typescript\n';
        output += code;
        output += '\n```\n';

        if (issues.length > 0) {
            output += `\n${'─'.repeat(80)}\n`;
            output += `ANÁLISIS DE CALIDAD:\n`;
            issues.forEach(issue => output += `${issue}\n`);
        }

        output += '='.repeat(80) + '\n';

        return { output, stats: { lines, imports: imports.length, issues, type } };
    } catch (error) {
        return {
            output: `\n⚠️ ERROR AL PROCESAR: ${relativePath}\n   Razón: ${error.message}\n`,
            stats: { lines: 0, imports: 0, issues: [], type: 'Error' }
        };
    }
}

/**
 * Escanea recursivamente un directorio
 */
function scanDirectory(dir, basePath = '') {
    const files = [];
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.join(basePath, entry.name);

            if (shouldIgnore(fullPath)) continue;

            if (entry.isDirectory()) {
                files.push(...scanDirectory(fullPath, relativePath));
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (VALID_EXTENSIONS.includes(ext)) {
                    files.push(relativePath);
                }
            }
        }
    } catch (error) {
        logger.error(`Error escaneando directorio ${dir}: ${error.message}`);
    }
    return files;
}

/**
 * Categoriza archivos por tipo
 */
function categorizeFiles(fileStats) {
    const categories = {};
    fileStats.forEach(({ file, stats }) => {
        const type = stats.type || 'Other';
        if (!categories[type]) categories[type] = [];
        categories[type].push(file);
    });
    return categories;
}

// ============================================================================
// EJECUCIÓN PRINCIPAL
// ============================================================================

logger.info('🚀 Iniciando análisis de arquitectura SII ERP AI (Frontend)...\n');
logger.info(`📁 Directorio base: ${BASE_DIR}\n`);

// Escanear
logger.info('📂 Escaneando estructura de directorios...');
const allFiles = scanDirectory(BASE_DIR);
logger.info(`✅ Encontrados ${allFiles.length} archivos para analizar\n`);

// Procesar
let fullDoc = '='.repeat(80) + '\n';
fullDoc += 'SII ERP AI FRONTEND - REPORTE DE ARQUITECTURA Y CÓDIGO\n';
fullDoc += `Fecha: ${new Date().toISOString()}\n`;
fullDoc += '='.repeat(80) + '\n\n';

const globalStats = {
    totalFiles: 0,
    totalLines: 0,
    issuesCount: 0,
    filesWithIssues: []
};

const processedFiles = [];

allFiles.forEach(file => {
    logger.info(`   Processing: ${file}`);
    const result = processFile(file);
    if (result) {
        fullDoc += result.output;
        globalStats.totalFiles++;
        globalStats.totalLines += result.stats.lines;
        if (result.stats.issues.length > 0) {
            globalStats.issuesCount += result.stats.issues.length;
            globalStats.filesWithIssues.push({ file, issues: result.stats.issues });
        }
        processedFiles.push({ file, stats: result.stats });
    }
});

// Resumen
const categories = categorizeFiles(processedFiles);

fullDoc += '\n\n' + '='.repeat(80) + '\n';
fullDoc += '🔎 RESUMEN EJECUTIVO\n';
fullDoc += '='.repeat(80) + '\n\n';

fullDoc += `📊 ESTADÍSTICAS:\n`;
fullDoc += `  - Archivos: ${globalStats.totalFiles}\n`;
fullDoc += `  - Líneas de código: ${globalStats.totalLines.toLocaleString()}\n`;
fullDoc += `  - Issues detectados: ${globalStats.issuesCount}\n`;

fullDoc += `\n📂 DISTRIBUCIÓN POR TIPO:\n`;
Object.entries(categories).sort((a, b) => b[1].length - a[1].length).forEach(([type, files]) => {
    fullDoc += `  - ${type}: ${files.length} archivos\n`;
});

if (globalStats.filesWithIssues.length > 0) {
    fullDoc += `\n⚠️ ARCHIVOS CON OBSERVACIONES (${globalStats.filesWithIssues.length}):\n`;
    globalStats.filesWithIssues.forEach(({ file, issues }) => {
        fullDoc += `  - ${file}\n`;
        issues.forEach(i => fullDoc += `    └─ ${i}\n`);
    });
}

// Escribir archivo
const outputPath = path.join(BASE_DIR, OUTPUT_FILE);
fs.writeFileSync(outputPath, fullDoc, 'utf-8');

logger.info(`\n${'='.repeat(80)}`);
logger.info(`✅ ANÁLISIS COMPLETADO`);
logger.info(`📄 Reporte generado en: ${outputPath}`);
logger.info(`${'='.repeat(80)}\n`);
