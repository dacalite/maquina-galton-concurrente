package com.concu_augusto_sergio.maquinagalton.controladores;

import com.concu_augusto_sergio.maquinagalton.dtos.ProduccionRequest;
import com.concu_augusto_sergio.maquinagalton.servicios.FabricaService;
import org.springframework.web.bind.annotation.*;

@RestController
public class FabricaController {

    private final FabricaService fabricaService;

    public FabricaController(FabricaService fabricaService) {
        this.fabricaService = fabricaService;
    }

    @PostMapping("/iniciar-produccion")
    public String iniciarProduccion(@RequestBody ProduccionRequest request) {
        fabricaService.iniciarProduccion(
                request.getNiveles(),
                request.getFabricasClavos(),
                request.getFabricasContenedores(),
                request.getFabricasBolas()
        );
        return "Producción iniciada con " + request.getNiveles() + " niveles!";
    }
}
