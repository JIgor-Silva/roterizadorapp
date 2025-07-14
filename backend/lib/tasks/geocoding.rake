# lib/tasks/geocoding.rake

namespace :geocoding do
  desc "Processa uma lista de endereços para obter suas coordenadas"
  task process_addresses: :environment do
    puts "Iniciando teste de geocodificação para os endereços que falharam..."

    enderecos = [
      "Rua Araré, 1017, Parque Guadalajara, Caucaia, CE",
      "Rua Paraná, 1998, Parque Albano, Caucaia, CE",
      "Rua Osvaldo Cruz, 3045, Parque Albano, Caucaia, CE"
    ]

    enderecos.each do |endereco|
      puts "\nBuscando: '#{endereco}'"
      resultados = Geocoder.search(endereco)
      resultado = resultados.first

      if resultado
        puts "  => SUCESSO! Endereço Encontrado: #{resultado.address}"
        puts "  => Coordenadas: [#{resultado.latitude}, #{resultado.longitude}]"
      else
        puts "  => ERRO: Endereço ainda não encontrado."
      end
      sleep(1)
    end

    puts "\nProcesso de teste finalizado."
  end
end
