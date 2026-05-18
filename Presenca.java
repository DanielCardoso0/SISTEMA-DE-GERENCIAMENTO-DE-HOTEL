
public class Presenca {

    private int idFuncionario;
    private String nomeFuncionario;
    private String estado;

    // CONSTRUTOR

    public Presenca(int idFuncionario,
                    String nomeFuncionario,
                    String estado) {

        this.idFuncionario = idFuncionario;
        this.nomeFuncionario = nomeFuncionario;
        this.estado = estado;
    }

    // GETTERS

    public int getIdFuncionario() {
        return idFuncionario;
    }

    public String getNomeFuncionario() {
        return nomeFuncionario;
    }

    public String getEstado() {
        return estado;
    }

    // MOSTRAR PRESENÇA

    public void mostrarPresenca() {

        System.out.println("\n======================");
        System.out.println("ID: " + idFuncionario);
        System.out.println("Nome: " + nomeFuncionario);
        System.out.println("Estado: " + estado);
        System.out.println("======================");
    }
}