import crypto from 'crypto';
import yaml from 'js-yaml';

export class Fragment {
    constructor(nodes, name) {
        this.nodes = nodes;  // el bloque completo de texto
        this.name = name;
        this.title = '';
        this.properties = {};
        this.functions = [];
        this.subtitles = [];
        this.paragraphs = [];
        this.prompt = '';
        this.sign = '';
        this.embedding = [];
        //this.parse(); // Ejecutar al inicio        
    }

    // Función utilitaria para ordenar objetos recursivamente
    #stableStringify(obj) {
        return JSON.stringify(obj, Object.keys(obj).sort(), 2);
    }
    
    getSign() {
        const contentToHash = this.#stableStringify({
            prompt: this.prompt,
            properties: this.properties,
            functions: this.functions
        });
    
        this.sign = crypto.createHash('sha256').update(contentToHash).digest('hex');
        return this.sign;
    }

    async getEmbedding(openai) {
        // ejemplo de cómo se llamaría, suponiendo que `openai` es una instancia del cliente de OpenAI
        const response = await openai.createEmbedding({
            model: 'text-embedding-3-small',
            input: this.prompt
        });
        this.embedding = response.data.data[0].embedding;
        return(this.empedding);
    }

    toJSON() {
        return {
            _id: this.sign,
            name: this.name,
            prompt: this.prompt,
            last_update: new Date().toISOString().split('T')[0],
            version: '1.0',
            properties: this.properties,
            functions: this.functions,
            embedding: this.embedding,
            sign: this.sign
        };
    }
    getProperties() {
        const yamlNode = this.nodes.find(n => n.type === 'code' && n.lang === 'yaml');
        if (!yamlNode) {
            this.properties = {};
            return;
        }
    
        const metadata = yaml.load(yamlNode.value) || {};
        this.properties = metadata.properties || {};
        return(this.properties);
    }
    getFunctions() {
        const yamlNode = this.nodes.find(n => n.type === 'code' && n.lang === 'yaml');
        if (!yamlNode) {
            this.functions = [];
            return;
        }
    
        const metadata = yaml.load(yamlNode.value) || {};
        const funcMeta = metadata.function || metadata.functions;
    
        if (!funcMeta) {
            this.functions = [];
            return(this.functions);
        }
    
        this.functions = Array.isArray(funcMeta) ? funcMeta : [funcMeta];
        return(this.functions)
    }
    getTitle() {
        const firstHeading = this.nodes.find(node => node.type === 'heading' && node.depth === 1);
        this.title = firstHeading?.children.map(c => c.value).join(' ') || '';        
        return(this.title);
    }
    getSubtitles() {
        this.subtitles = this.nodes
            .filter(node => node.type === 'heading' && node.depth > 1)
            .map(node => node.children.map(c => c.value).join(' '));    
        
        return(this.subtitles);
    }
    
    getParagraphs() {
        this.paragraphs = this.nodes
            .filter(node => node.type === 'paragraph')
            .map(node =>
                node.children.map(c => c.value).join('').replace(/^\s+|\s+$/g, '')
            );
    
        return this.paragraphs;
    }
    
    getPrompt() {
        const parts = [this.title, ...this.subtitles, ...this.paragraphs];
    
        let raw = parts
            .filter(Boolean) // eliminar nulls o strings vacíos
            .join('\n')      // usamos \n para mantener estructura básica
    
            // quitar espacios redundantes por línea
            .replace(/^[ \t]+|[ \t]+$/gm, '')
    
            // reemplazar múltiples saltos por uno solo
            .replace(/\n{2,}/g, '\n')
    
            // reemplazar múltiples espacios seguidos (también tabs) por uno solo
            .replace(/[ \t]+/g, ' ')
    
            // recorte final
            .trim();
    
        this.prompt = raw;
        return(this.prompt);
    }
    getFlatPrompt() {
        return this.prompt.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    }    
    process()
    {
        this.getTitle();
        this.getProperties();
        this.getFunctions();
        this.getSubtitles();
        this.getParagraph();
        this.getPrompt();        
        this.getSign();
        //this.toJSON();
        //console.log('title', this.getTitle());
        //console.log('properties', this.getProperties());
        //console.log('functions', this.getFunctions());
        //console.log('subtitles', this.getSubtitles());
        //console.log('paragraphs', this.getParagraph());
        //console.log('prompt', this.getPrompt());
        //console.log('sign', this.getSign());
        //console.log('process fragment', this.toJSON());

    }
    
}
