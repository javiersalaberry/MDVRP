namespace VisorADP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AdpMigration : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Usuario", "codpostal", c => c.String());
            AlterColumn("dbo.Usuario", "Direccion", c => c.String(nullable: false));
            AlterColumn("dbo.Usuario", "Ciudad", c => c.String(nullable: false));
            AlterColumn("dbo.Usuario", "Departamento", c => c.String(nullable: false));
            AlterColumn("dbo.Usuario", "Pais", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Usuario", "Pais", c => c.String());
            AlterColumn("dbo.Usuario", "Departamento", c => c.String());
            AlterColumn("dbo.Usuario", "Ciudad", c => c.String());
            AlterColumn("dbo.Usuario", "Direccion", c => c.String());
            DropColumn("dbo.Usuario", "codpostal");
        }
    }
}
