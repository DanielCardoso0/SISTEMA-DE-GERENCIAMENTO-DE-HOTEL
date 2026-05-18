public class Funcionario {

    private int id;
    private String nome;
    private String bi;
    private String cargo;
    private double salario;
    private String telefone;
    private String turno;


    public Funcionario(int id, String nome, String bi,
                       String cargo, double salario,
                       String telefone, String turno) {

        this.id = id;
        this.nome = nome;
        this.bi = bi;
        this.cargo = cargo;
        this.salario = salario;
        this.telefone = telefone;
        this.turno = turno;
    }



    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getBi() {
        return bi;
    }

    public String getCargo() {
        return cargo;
    }

    public double getSalario() {
        return salario;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getTurno() {
        return turno;
    }



    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public void setSalario(double salario) {
        this.salario = salario;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }


    public void mostrarDados() {

        System.out.println("\n=================================");
        System.out.println("ID: " + id);
        System.out.println("Nome: " + nome);
        System.out.println("BI: " + bi);
        System.out.println("Cargo: " + cargo);
        System.out.println("Salário: " + salario + " Kz");
        System.out.println("Telefone: " + telefone);
        System.out.println("Turno: " + turno);
        System.out.println("=================================");
    }
}