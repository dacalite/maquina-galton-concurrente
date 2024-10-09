package com.concu_augusto_sergio.maquinagalton.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProduccionRequest {
    private int niveles;
    private int fabricasClavos;
    private int fabricasContenedores;
    private int fabricasBolas;
}