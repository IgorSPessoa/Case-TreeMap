// Adiciona um evento ao documento que será acionado quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Define um esquema de cores padrão do D3
    const colors = d3.schemePaired;

    // Define a população total do Brasil em 2010
    const totalPopulation = 203080756;

    // Dados de população por estado em 2010
    const data = [
        { name: "São Paulo", value: 44411238 },
        { name: "Minas Gerais", value: 20539989 },
        { name: "Rio de Janeiro", value: 16055174 },
        { name: "Bahia", value: 14141626 },
        { name: "Paraná", value: 11444380 },
        { name: "Rio Grande do Sul", value: 10882965 },
        { name: "Pernambuco", value: 9058931 },
        { name: "Ceará", value: 8794957 },
        { name: "Amazonas", value: 3941613 },
        { name: "Maranhão", value: 6776699 },
        { name: "Espírito Santo", value: 3833712 },
        { name: "Goiás", value: 7056495 },
        { name: "Paraíba", value: 3974687 },
        { name: "Sergipe", value: 2210004 },
        { name: "Alagoas", value: 3127683 },
        { name: "Piauí", value: 3271199 },
        { name: "Distrito Federal", value: 2817381 },
        { name: "Rio Grande do Norte", value: 3302729 },
        { name: "Tocantins", value: 1511460 },
        { name: "Mato Grosso", value: 3658649 },
        { name: "Mato Grosso do Sul", value: 2757013 },
        { name: "Acre", value: 830018 },
        { name: "Amapá", value: 7337596 },
        { name: "Roraima", value: 636707 },
        { name: "Pará", value: 8120131 },
        { name: "Rondônia", value: 1581196 },
        { name: "Santa Catarina", value: 7610361 }
    ];

    // Atualiza o subtítulo com o total da população
    document.getElementById('total-population').textContent = totalPopulation.toLocaleString();

    // Seleciona o contêiner do treemap e adiciona um elemento SVG com altura e largura de 100%
    const svg = d3.select('#treemap-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    // Define a função de treemap com tamanho de 500x500 pixels e padding de 1 pixel
    const treemap = d3.treemap()
        .size([500, 500])
        .padding(1);

    // Cria uma hierarquia a partir dos dados e calcula os valores das somas dos nós
    const root = d3.hierarchy({ name: "Brasil", children: data })
        .sum(d => d.value);

    // Função para atualizar o treemap
    function updateTreemap() {
        // Gera o layout do treemap
        treemap(root);

        // Seleciona todos os nós existentes no treemap
        const no = svg.selectAll('.no')
            .data(root.leaves(), d => d.data.name);

        // Entra novos nós e mescla com os existentes
        no.enter().append('rect')
            .attr('class', 'no')
            .merge(no)
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('fill', (d, i) => colors[i % colors.length]) // Define a cor do nó
            .style('stroke', '#fff')
            .style('stroke-width', '0px');

        // Remove os nós que não são mais necessários ou sem dado ligado
        no.exit().remove();
    }

    // Função para gerar a barra lateral com informações dos estados
    function generateSidebar() {
        // Seleciona o contêiner da barra lateral e limpa seu conteúdo
        const container = document.getElementById('inputs-container');
        container.innerHTML = '';

        // Para cada estado nos dados, cria um grupo de informações
        data.forEach((state, index) => {
            const infoGroup = document.createElement('div');
            infoGroup.className = 'input-group';

            // Cria um box de cor representando a cor do estado no treemap
            const colorBox = document.createElement('span');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = colors[index % colors.length];

            // Adiciona o nome do estado e sua população formatada
            const text = document.createElement('span');
            text.textContent = `${state.name}: ${state.value.toLocaleString()}`;
            text.style.marginLeft = '10px';

            // Adiciona o box de cor e o texto ao grupo de informações
            infoGroup.appendChild(colorBox);
            infoGroup.appendChild(text);
            // Adiciona o grupo de informações ao contêiner da barra lateral
            container.appendChild(infoGroup);
        });
    }

    // Gera a barra lateral e atualiza o treemap ao carregar o documento
    generateSidebar();
    updateTreemap();
});
