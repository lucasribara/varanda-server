
export const setOrderState = (code) => {
    switch (code) {
        case 1:
            return {code: 1, text:"Aguardando confirmação"};
        case 2:
            return {code: 2, text:"Pedido em preparação"};
        case 3:
            return {code: 3, text:"Pedido pronto para retirada"};
        case 4:
            return {code: 4, text: "Concluido"} ;
        case 5:
            return { code: 5, text:"Finalizado"};
        case 0:
            return {code: 0, text:"Cancelado"};
        default:
            return null;
    }
}