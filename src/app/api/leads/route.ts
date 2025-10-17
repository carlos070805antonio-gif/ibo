// app/api/leads/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { 
      imovel_id, 
      imovel_tipo, 
      imovel_bairro, 
      imovel_cidade,
      nome, 
      email, 
      telefone, 
      mensagem 
    } = body;

    // Validação básica
    if (!nome || !email || !imovel_id) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email e imovel_id" },
        { status: 400 }
      );
    }

    // Enviar e-mail para a imobiliária
    const emailData = await resend.emails.send({
      from: "Imobiliária <onboarding@resend.dev>", // No plano grátis use este
      to: ["carlos.070805.antonio@gmail.com"], // ← SEU E-MAIL AQUI
      subject: `🏡 Novo Interesse: ${imovel_tipo} em ${imovel_bairro}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #f59e0b; }
              .label { font-weight: bold; color: #64748b; font-size: 14px; }
              .value { color: #1e293b; font-size: 16px; margin-top: 5px; }
              .imovel-info { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🏡 Novo Lead Recebido!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Um cliente demonstrou interesse em um imóvel</p>
              </div>
              
              <div class="content">
                <div class="imovel-info">
                  <h2 style="margin: 0 0 10px 0; color: #d97706;">Imóvel de Interesse</h2>
                  <p style="margin: 5px 0;"><strong>Tipo:</strong> ${imovel_tipo}</p>
                  <p style="margin: 5px 0;"><strong>Localização:</strong> ${imovel_bairro}, ${imovel_cidade}</p>
                  <p style="margin: 5px 0;"><strong>ID:</strong> #${imovel_id}</p>
                </div>

                <h3 style="color: #1e293b; margin: 25px 0 15px 0;">📋 Dados do Cliente</h3>
                
                <div class="info-box">
                  <div class="label">Nome Completo</div>
                  <div class="value">${nome}</div>
                </div>

                <div class="info-box">
                  <div class="label">E-mail</div>
                  <div class="value"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></div>
                </div>

                ${telefone ? `
                  <div class="info-box">
                    <div class="label">Telefone</div>
                    <div class="value"><a href="tel:${telefone}" style="color: #f59e0b;">${telefone}</a></div>
                  </div>
                ` : ''}

                ${mensagem ? `
                  <div class="info-box">
                    <div class="label">Mensagem</div>
                    <div class="value">${mensagem}</div>
                  </div>
                ` : ''}

                <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
                  <p style="margin: 0; color: #1e40af; font-weight: 600;">
                    ⚡ Entre em contato o quanto antes para não perder essa oportunidade!
                  </p>
                </div>
              </div>

              <div class="footer">
                <p>Este e-mail foi enviado automaticamente pelo sistema da imobiliária</p>
                <p>Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("E-mail enviado:", emailData);

    return NextResponse.json(
      { 
        success: true, 
        message: "Interesse enviado com sucesso!",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}