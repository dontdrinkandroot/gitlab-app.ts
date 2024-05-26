import {Pipe, PipeTransform} from "@angular/core";
import {Project} from "./project";

@Pipe({
    standalone: true,
    name: 'gaProjectGenericAvatarData'
})
export class ProjectGenericAvatarDataPipe implements PipeTransform {
    /**
     * @override
     */
    public transform(project: Project): string {
        try {
            /* Render svg image containing the uppercase start letter of the project and base64 encode it */
            const startLetter = project.name.charAt(0).toUpperCase();
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#ffffff"/>
            <text x="50" y="50" font-family="Roboto" font-size="50" text-anchor="middle" fill="#000000" dominant-baseline="middle">${startLetter}</text>
        </svg>`;
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        } catch (DomException) {
            console.error('Failed to render project generic avatar data', project.name, DomException);
            return ProjectGenericAvatarDataPipe.emptySvg();
        }
    }

    private static emptySvg(): string {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#ffffff"/>
        </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
}
