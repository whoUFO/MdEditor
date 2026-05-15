import { HTMLExporter, ALL_TEMPLATES } from '@markdown-editor/html-export';

console.log('Testing import...');
console.log('Templates:', ALL_TEMPLATES.map(t => t.id));

const exporter = new HTMLExporter();
console.log('Exporter created successfully');
