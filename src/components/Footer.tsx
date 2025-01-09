import React from 'react';
import { Phone, Globe, Mail, MapPin, Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/90 backdrop-blur-sm shadow-lg mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Empresa */}
          <div>
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Like Look Solutions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Desenvolvendo soluções inovadoras e criativas para transformar suas ideias em realidade.
            </p>
            <a
              href="https://likelook.wixsite.com/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2 text-sm"
            >
              <Globe className="w-4 h-4" />
              likelook.wixsite.com/solutions
            </a>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Contato</h3>
            <div className="space-y-3">
              <a
                href="tel:+5511970603441"
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +55 (11) 97060-3441
              </a>
              <a
                href="https://wa.me/5511970603441"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Desenvolvedor */}
          <div>
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Desenvolvedor</h3>
            <p className="text-sm text-gray-600 mb-2">
              Desenvolvido por Julio Campos Machado
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/juliocamposmachado"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/juliocamposmachado"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Like Look Solutions. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};