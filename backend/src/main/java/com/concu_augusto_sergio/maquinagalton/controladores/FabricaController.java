package com.concu_augusto_sergio.maquinagalton.controladores;

import com.concu_augusto_sergio.maquinagalton.dtos.ProduccionRequest;
import com.concu_augusto_sergio.maquinagalton.servicios.FabricaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class FabricaController {

    @Autowired
    private FabricaService fabricaService;

    public FabricaController(FabricaService fabricaService) {
        this.fabricaService = fabricaService;
    }

    @GetMapping("/building-info")
    public Map<String, Integer> obtenerInformacionEdificio() {
        Map<String, Integer> response = new HashMap<>();
        response.put("contadorClavos", fabricaService.getContadorClavos());
        response.put("contadorContenedores", fabricaService.getContadorContenedores());
        response.put("contadorBolas", fabricaService.getContadorBolas());
        response.put("contadorTableros", fabricaService.getContadorTableros());
        return response;
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
