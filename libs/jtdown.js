/* ##################################
 #
 #   jtDown by @JaviertINC - v0.0.5
 #
 * ################################## */

var jtdown = function(str){

	var rules = [
		// titles
		['/(#+) (.*)/g', function(chars, header){
			var level = chars.length;
			return '<h'+level+'>'+header.trim()+'</h'+level+'>';
		}],

		// Captys
		['/\\[captys\\-([0-9]{2}|[0-9]{3}|[0-9]{4})\\x([0-9]{2}|[0-9]{3}|[0-9]{4})\\]\\(\\https\\:\\/\\/javiertinc\\.cl\\/captys\\/c\\//gi', '[captys-\\1x\\2]('],
		['/\\[captys\\-([0-9]{2}|[0-9]{3}|[0-9]{4})\\x([0-9]{2}|[0-9]{3}|[0-9]{4})\\]\\(([^\\(]+)\\)/g', '<blockquote class="jt-captys-embed" data-theme="captys" data-width="\\1" data-height="\\2" data-id="\\3"><a href="https://javiertinc.cl/captys/c/\\3" target="_blank">Ver captura</a></blockquote><script async src="//javiertinc.cl/libs/js/captys.embed.js" charset="utf-8"></script>'],
				
		// Youtube
		['/\\[yt\\]\\(\\https\\:\\/\\/youtu.be\\//gi', '[yt]('],
		['/\\[yt\\]\\(\\https\\:\\/\\/youtube.com\\/watch\\?v\\=/gi', '[yt]('],
		['/\\[yt\\]\\(\\https\\:\\/\\/youtube.com\\/embed\\//gi', '[yt]('],
		['/\\[yt\\]\\(\\https\\:\\/\\/www.youtube.com\\/watch\\?v\\=/gi', '[yt]('],
		['/\\[yt\\]\\(\\https\\:\\/\\/www.youtube.com\\/embed\\//gi', '[yt]('],
		['/\\[yt\\]\\(\\https\\:\\/\\/www.youtube-nocookie.com\\/embed\\//gi', '[yt]('],
		['/\\[yt\\]\\(([^\\(]+)\\)/g', '<iframe class="jt-teextus-embed yt" src="https://www.youtube-nocookie.com/embed/\\1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
		
		// links
        ['/\\[([^\\[]+)\\]\\(([^\\(]+)\\)/g', '<a href=\"\\2\" target="blank">\\1</a>'],
        
		// bold
        ['/(\\*\\*)(.*?)\\1/g', '<strong>\\2</strong>'],

		// italic
        ['/(\\/\\/)(.*?)\\1/g', '<em>\\2</em>'],
        
		// strike
		['/(\\~\\~)(.*?)\\1/g', '<del>\\2</del>'],
        
		// underline
        ['/(\\_\\_)(.*?)\\1/g', '<u>\\2</u>'],
        
		// separator
		['/---/g', '<hr/>'],
		
		// salto de linea
		['/\n\n/g', '<br/>'],
		['/  \n/g', '<br/>'],
		
		// hearth
		['/<3/g', '<i class="fa fa-heart fa-fw"></i>'],
		
		// icons
        ['/\\!\\!(fa|far|fab)\\-((.*))/gi', '<i class="\\1 fa-\\2 fa-fw"></i>'],
        
		// quote
        ['/\\:\\"(.*?)\\"\\:/g', '<q>\\1</q>'],
		
		// blockquote
		['/\\n\\> (.*)/g', function(str){
			return '<blockquote>'+str.trim()+'</blockquote>';
		}],

		// blockquote in blockquote
		['/\\n\\>\\>(.*)/g', function(str){
			return '<blockquote><blockquote>'+str.trim()+'</blockquote></blockquote>';
		}],

		// color
		['/(\\^\\!([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\1\\^)/g', '<span style="color: #\\2!important;">'],
		['/(\\^\\!\\^)/g', '</span>'],
        
		// list
		['/\\n\\*(.*)/g', function(item){
			return '<ul>\n<li>'+item.trim()+'</li>\n</ul>';
		}],
		// ordered list
		['/\\n[0-9]+\\.(.*)/g', function(item){
			return '<ol>\n<li>'+item.trim()+'</li>\n</ol>';
		}],

		// paragraphs
		['/\\n[^\\n]+\\n/g', function(line){
			line = line.trim();
			if(line[0] === '<'){
				return line;
			}
			return '\n<p>'+line+'</p>\n';
		}]
	]
    var preg_replace = function(a, b, c, d) {
        void 0 === d && (d = -1);
        var e = a.substr(a.lastIndexOf(a[0]) + 1),
            f = a.substr(1, a.lastIndexOf(a[0]) - 1),
            g = RegExp(f, e),
            i = [],
            j = 0,
            k = 0,
            l = c,
            m = [];
        if (-1 === d) {
            do m = g.exec(c), null !== m && i.push(m); while (null !== m && -1 !== e.indexOf("g"))
        } else i.push(g.exec(c));
        for (j = i.length - 1; j > -1; j--) {
            for (m = b, k = i[j].length; k > -1; k--) m = m.replace("${" + k + "}", i[j][k]).replace("$" + k, i[j][k]).replace("\\" + k, i[j][k]);
            l = l.replace(i[j][0], m)
        }
        return l
    };
	var parse_line = function(str){
		str = "\n" + str.trim() + "\n";
		for(var i = 0, j = rules.length; i < j; i++){
			if(typeof rules[i][1] == 'function') {
				var _flag = rules[i][0].substr(rules[i][0].lastIndexOf(rules[i][0][0])+1),
					_pattern = rules[i][0].substr(1, rules[i][0].lastIndexOf(rules[i][0][0])-1),
					reg	= new RegExp(_pattern, _flag);

				var matches = reg.exec(str);
				if(matches !== null){
					if(matches.length > 1){
						str = preg_replace(rules[i][0], rules[i][1](matches[1], matches[2]), str);
					}
					else
					{
						str = preg_replace(rules[i][0], rules[i][1](matches[0]), str);
					}
				}
			}
			else {
				str = preg_replace(rules[i][0], rules[i][1], str);
			}
		}
		return str.trim();
	};

	str = str.split('\n');
	var rtn = [];
	for(var i = 0, j = str.length; i < j; i++){
		rtn.push(parse_line(str[i]));
	}

	rtn = rtn.join('\n');

	return rtn;
};
